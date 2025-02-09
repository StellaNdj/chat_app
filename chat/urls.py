from .views import RegisterViewSet, UserDetailsViewSet, MessageViewSet, ConversationViewSet, PublicUserProfileViewSet, SearchView, UserProfileView
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

app_name = 'chat'

router = DefaultRouter()

router.register(r'register', RegisterViewSet, basename='register')
router.register(r'user', UserDetailsViewSet, basename='user')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'conversations', ConversationViewSet, basename='conversations')
router.register(r'public_profile', PublicUserProfileViewSet, basename='public_profile')


urlpatterns = [
    path('', include(router.urls)),
    path('search/', SearchView.as_view(), name='search'),
    path('profile/', UserProfileView.as_view(), name='profile')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
