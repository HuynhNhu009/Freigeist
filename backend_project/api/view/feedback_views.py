from rest_framework import viewsets
from api.models import Feedback, FeedbackType
from ..serializers import FeedbackSerializer, FeedbackTypeSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class FeedbackTypeViewSet(viewsets.ModelViewSet):
    queryset = FeedbackType.objects.all()
    serializer_class = FeedbackTypeSerializer
