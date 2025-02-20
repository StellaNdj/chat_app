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

        # Add the user to the chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Change profile status
        await set_user_online_status(user.id, True)

        # Mark messages as read
        await self.mark_messages_as_read()

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


    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == "chat_message":
            message_content = data.get('message', '')
            sender_id = data['sender']
            image_url = data.get('image_url', None)

            # Save the message to the db
            converation = await self.get_conversation(self.room_name)
            sender = await self.get_user(sender_id)

                # Supporting images as messages
            message = await self.create_message(converation, sender, message_content, image_url)

            # Broadcast message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'type': 'chat_message',
                        'content': message.content,
                        'sender': message.sender.id,
                        'timestamp': message.timestamp.isoformat(),
                        'image_url': image_url
                    },
                }
            )

        elif message_type == "reaction":
            message_id = data['message_id']
            reaction = data['reaction']
            user_id = data['user_id']

            print(f"Reaction received: {message_id}, {user_id}, {reaction}")

            # Update the reaction
            await self.update_reaction(message_id, user_id, reaction)

            # Broadcast the updated reaction
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'reaction',
                    'message_id': message_id,
                    'reaction': reaction,
                    'user_id': user_id
                }
            )

        # Handle typing
        if data.get("type") == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "user": data['user'],
                    "is_typing": data['is_typing'],
                }
            )
            return

        # Handle deleting message
        if data.get("type") == "delete_message":
            message_id = data["message_id"]
            await self.delete_message(message_id)


    async def update_reaction(self, message_id, user_id, reaction):
        print(f"Updating reaction for message {message_id} by user {user_id}")
        message = await database_sync_to_async(Message.objects.get)(id=message_id)
        reactions = message.reactions

        if reaction:  # Add/update reaction
            reactions[str(user_id)] = reaction
        elif str(user_id) in reactions:  # Remove reaction
            del reactions[str(user_id)]

        message.reactions = reactions
        await database_sync_to_async(message.save)(update_fields=['reactions'])

    async def reaction(self, event):
        await self.send(text_data=json.dumps({
            'type': 'reaction',
            'message_id': event['message_id'],
            'reaction': event['reaction'],
            'user_id': event['user_id']
        }))


    async def typing_status(self, event):
        # Broadcast typing status to all members
        await self.send(text_data=json.dumps(
            {
                'type': 'typing',
                "user": event["user"],
                "is_typing": event['is_typing'],
            }

        ))

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
        await self.send(text_data=json.dumps(
            {
                "type": "read_receipt",
                "user": event['user']
            }
        ))

    async def delete_message_ws(self, event):
        await self.send(text_data=json.dumps({
        "type": "delete_message",
        "message_id": event["message_id"]
    }))

    # Database operations must use `database_sync_to_async`
    @database_sync_to_async
    def get_conversation(self, room_name):
        return Conversation.objects.get(id=room_name)

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def create_message(self, conversation, sender, content, image=None):
        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content,
            image=image
        )
    @database_sync_to_async
    def delete_message(self, message_id):
        message = Message.objects.get(id=message_id)
        if message.sender.id == self.scope["user"].id:
            message.delete()

@database_sync_to_async
def set_user_online_status(user, online):
    profile = UserProfile.objects.get(user=user)
    profile.is_online = online
    profile.save()
