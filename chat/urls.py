from .views import RegisterViewSet, UserDetailsViewSet, MessageViewSet, ConversationViewSet, UserProfileViewSet, PublicUserProfileViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include

app_name = 'chat'

router = DefaultRouter()

router.register(r'register', RegisterViewSet, basename='register')
router.register(r'user', UserDetailsViewSet, basename='user')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'conversations', ConversationViewSet, basename='conversations')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'public_profile', PublicUserProfileViewSet, basename='public_profile')


urlpatterns = [
    path('', include(router.urls)),
]
