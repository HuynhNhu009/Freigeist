from rest_framework import viewsets
from api.models import Reminder
from ..serializers import ReminderSerializer


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)  # Chỉ trả về reminder của người dùng đó

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Gán user từ request