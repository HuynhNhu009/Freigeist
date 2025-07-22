from rest_framework import viewsets
from api.models import DiaryTag
from api.serializers import DiaryTagSerializer

class DiaryTagViewSet(viewsets.ModelViewSet):
    queryset = DiaryTag.objects.all()
    serializer_class = DiaryTagSerializer
