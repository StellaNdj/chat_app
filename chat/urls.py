from .views import RegisterViewSet, UserDetailsViewSet, MessageViewSet, ConversationViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include

app_name = 'chat'

router = DefaultRouter()

router.register(r'register', RegisterViewSet, basename='register')
router.register(r'user', UserDetailsViewSet, basename='user')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'conversations', ConversationViewSet, basename='conversations')

urlpatterns = [
    path('', include(router.urls)),
]
