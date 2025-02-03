from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime
from .models import Message, Conversation, UserProfile
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        user = self.scope['user']
        print(user.id)

        # Add the user to the chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Change profile status
        await set_user_online_status(user.id, True)

        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope['user']

        # Remove the user from the chat
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # Change profile status
        await set_user_online_status(user.id, False)

        await self.mark_messages_as_read()

    async def receive(self, text_data):
        print("WebSocket message received:", text_data)
        data = json.loads(text_data)
        message_content = data['message']
        sender_id = data['sender']

        # Save the message to the database
        conversation = await self.get_conversation(self.room_name)
        sender = await self.get_user(sender_id)

        message = await self.create_message(conversation, sender, message_content)

        print("Broadcasting message:", message.content)

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'content': message.content,
                    'sender': message.sender.id,
                    'timestamp': message.timestamp.isoformat(),
                },
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send the structured message to WebSocket
        await self.send(text_data=json.dumps(message))


    async def mark_messages_as_read(self):
        user = self.scope['user']
        if user.is_authenticated:
            await database_sync_to_async(self._update_messages_as_read)(user)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "read_receipt",
                "user": user.username
            }
        )

    def _update_messages_as_read(self, user):
        conversation = Conversation.objects.get(id=self.room_name)
        Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(sender=user).update(is_read=True)

    async def read_receipt(self, event):
        print(f"Sending read receipt for {event['user']}")  # Debugging

        await self.send(text_data=json.dumps(
            {
                "type": "read_receipt",
                "user": event['user']
            }
        ))

    # Database operations must use `database_sync_to_async`
    @database_sync_to_async
    def get_conversation(self, room_name):
        return Conversation.objects.get(id=room_name)

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def create_message(self, conversation, sender, content):
        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )
@database_sync_to_async
def set_user_online_status(user, online):
    profile = UserProfile.objects.get(user=user)
    profile.is_online = online
    profile.save()
