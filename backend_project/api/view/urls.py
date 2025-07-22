from rest_framework.routers import DefaultRouter
from .view.user_views import UserViewSet
from .view.diary_views import DiaryEntryViewSet, DiaryImageViewSet
from .view.tag_views import TagViewSet
from .view.reminder_views import ReminderViewSet
from .view.feedback_views import FeedbackViewSet, FeedbackTypeViewSet
from .view.response_views import ResponseViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'diaries', DiaryEntryViewSet)
router.register(r'images', DiaryImageViewSet)
router.register(r'tags', TagViewSet)
router.register(r'reminders', ReminderViewSet)
router.register(r'feedbacks', FeedbackViewSet)
router.register(r'feedback-types', FeedbackTypeViewSet)
router.register(r'responses', ResponseViewSet)

urlpatterns = router.urls
