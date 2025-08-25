from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from api.models import Feedback, FeedbackType
from ..serializers import FeedbackSerializer, FeedbackTypeSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    # Chỉ lấy feedback của chính user
    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user)

    # Khi tạo feedback thì tự gán user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedbackTypeViewSet(viewsets.ModelViewSet):
    queryset = FeedbackType.objects.all()
    serializer_class = FeedbackTypeSerializer
