from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DiaryImage  # Add this import
from .serializers import DiaryImageSerializer

class DiaryImageViewSet(viewsets.ModelViewSet):
    queryset = DiaryImage.objects.all()
    serializer_class = DiaryImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DiaryImage.objects.filter(diary_entry__user=self.request.user)
