from django.shortcuts import render
from .models import Message, Conversation, UserProfile
from django.contrib.auth.models import User
from .serializers import UserSerializer, ConversationSerializer, MessageSerializer, UserDetailsSerializer, UserProfileSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from rest_framework.generics import RetrieveUpdateAPIView
# Create your views here.

# Registration view
class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# User details view
class UserDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })



# User Profile view
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = UserProfile.objects.all()

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        profile = UserProfile.objects.filter(user=self.request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        profile = UserProfile.objects.get(user=self.request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()

    def create(self, request, *args, **kwargs):
        # Get request data
        participants = request.data.get('participants', [])
        content = request.data.get('content')
        sender = request.user

        # print(participants)

        if not content:
            return Response({"error": "Content must not be empty"}, status=400)

        # Ensure sender is included in participants
        if sender.id not in participants:
            participants.append(sender.id)

        # Validate participants
        participants_users = User.objects.filter(id__in=participants).distinct()
        # print(participants_users)
        if participants_users.count() < 2:
            return Response({"error": "A conversation requires at least two participants"}, status=400)

        # Find or create a conversation
        conversation = self.get_or_create_conversation(participants_users)
        # print(conversation)

        # Create a message
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )

        serializer = self.get_serializer(message)
        return Response(serializer.data, status=201)

    def get_or_create_conversation(self, participants_users):
        """
        Finds an existing conversation with the exact participants or creates a new one.
        """
        # Retrieve conversations that include all the participants
        conversations = Conversation.objects.filter(
            participants__in=participants_users
        ).distinct()

        # Filter conversations to match the exact participants
        for conv in conversations:
            # Get the participants of the conversation as a set of IDs
            conv_participant_ids = set(conv.participants.values_list('id', flat=True))
            expected_participant_ids = set(participants_users.values_list('id', flat=True))

            if conv_participant_ids == expected_participant_ids:
                return conv

        # Create a new conversation if no exact match is found
        conversation = Conversation.objects.create()
        conversation.participants.set(participants_users)
        conversation.save()
        return conversation


# Conversation view
class ConversationViewSet(viewsets.ModelViewSet):
    # Conversations are always created through messages to avoid empty conversation

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)
