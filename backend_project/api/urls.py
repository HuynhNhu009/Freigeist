from rest_framework.routers import DefaultRouter
from .view.user_views import UserViewSet
from .view.diary_views import DiaryImageViewSet, DiaryEntryViewSet
from .view.tag_views import TagViewSet
from .view.reminder_views import ReminderViewSet
from .view.feedback_views import FeedbackViewSet, FeedbackTypeViewSet
from .view.response_views import ResponseViewSet
from .view.diarytag_views import DiaryTagViewSet
from .view.user_views import RegisterView
from .view.user_views import LoginView
from .view.user_views import LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path



router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'diaries', DiaryEntryViewSet)
router.register(r'images', DiaryImageViewSet)
router.register(r'tags', TagViewSet)
router.register(r'reminders', ReminderViewSet)
router.register(r'feedbacks', FeedbackViewSet)
router.register(r'feedback-types', FeedbackTypeViewSet)
router.register(r'responses', ResponseViewSet)
router.register(r'diary-tags', DiaryTagViewSet)



urlpatterns = router.urls

urlpatterns = router.urls + [
    path('login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
]


