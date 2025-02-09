from django.shortcuts import render, get_object_or_404
from .models import Message, Conversation, UserProfile
from django.contrib.auth.models import User
from .serializers import UserSerializer, ConversationSerializer, MessageSerializer, UserDetailsSerializer, UserProfileSerializer, PublicProfileUserSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.decorators import action
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

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# User Profile view viewset version
# class UserProfileViewSet(viewsets.ModelViewSet):
#     serializer_class = UserProfileSerializer
#     permission_classes = [IsAuthenticated]
#     parser_classes = (MultiPartParser, FormParser)

#     def get_queryset(self):
#         return UserProfile.objects.filter(user=self.request.user.id)

#     def get_object(self):
#         """Ensure the user can only update their own profile"""
#         return UserProfile.objects.get(user=self.request.user)

#     @action(detail=False, methods=['patch'], url_path='update')
#     def update_profile(self, request, *args, **kwargs):
#         # profile = UserProfile.objects.get(user=self.request.user)
#         profile = self.get_object()
#         serializer = UserProfileSerializer(profile, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)
class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        """Ensure the user can only access their own profile"""
        return UserProfile.objects.get(user=self.request.user)

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

# Public Profile view
class PublicUserProfileViewSet(ReadOnlyModelViewSet):
    serializer_class = PublicProfileUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.request.query_params.get('username')
        return UserProfile.objects.filter(user__username=username)


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

class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.GET.get("q", "").strip()
        user = request.user  # Logged-in user

        if not query:
            return Response({"error": "Query cannot be empty"}, status=400)

        # Check if the searched user exists
        try:
            searched_user = User.objects.get(username__iexact=query)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=404)

        # Check if a conversation exists between the logged-in user and the searched user
        conversation = Conversation.objects.filter(
            participants=user
        ).filter(
            participants=searched_user
        ).distinct().first()

        if conversation:
            return Response({
                "type": "conversation",
                "conversation": ConversationSerializer(conversation, context={"request": request}).data
            })

        # If no conversation exists, return user details so frontend can start one
        return Response({
            "type": "new_user",
            "user": UserSerializer(searched_user).data
        })
