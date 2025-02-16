from rest_framework import serializers
from .models import Message, Conversation, UserProfile
from django.contrib.auth.models import User

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

# Profiles
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ['user', 'image_url', 'image', 'is_online']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class PublicProfileUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'image_url', 'is_online']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

# Message serializer
class MessageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'image_url', 'timestamp', 'is_read', 'reactions']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

# Conversation serializer
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    user_images = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at', 'messages', 'other_user', 'last_message', 'user_images', 'name']

    def get_other_user(self, obj):
        requesting_user = self.context['request'].user
        other_users = obj.participants.exclude(id=requesting_user.id)

        return [
            {"id": user.id, "username": user.username}
            for user in other_users
        ] if other_users.exists() else None

    def get_last_message(self, obj):
        last_message = obj.messages.last()

        if last_message:
            return {
                "content": last_message.content,
                "timestamp": last_message.timestamp
            }
        return None

    def get_user_images(self, obj):
        requesting_user = self.context['request'].user
        images = []
        for user in obj.participants.exclude(id=requesting_user.id):
            profile = getattr(user, 'userprofile', None)

            if profile and profile.image:
                images.append({'user_id': user.id, 'image_url': profile.image.url})
        return images
