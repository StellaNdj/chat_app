from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Conversation model
class Conversation(models.Model):
    participants = models.ManyToManyField(User,related_name='conversations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation between {','.join(user.username for user in self.participants.all())}"

# Message model
class Message(models.Model):
    conversation = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"${self.content} by ${self.sender}"
