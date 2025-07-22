from rest_framework import viewsets
from api.models import DiaryEntry, DiaryImage
from ..serializers import DiaryEntrySerializer, DiaryImageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from ollama_client import analyze_entry
import json

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()  # Thêm dòng này để router hiểu
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return DiaryEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)

        try:
            analysis = analyze_entry(instance.de_content)
            result = json.loads(analysis)  # JSON từ chuỗi LLM trả về
            instance.de_emoScore = result.get("de_emoScore")
            instance.de_emoState = result.get("de_emoState")
            instance.de_advice = result.get("de_advice")
            instance.save()
        except Exception as e:
            print("LLM analysis failed:", e)

class DiaryImageViewSet(viewsets.ModelViewSet):
    queryset = DiaryImage.objects.all()  # 💡 Dòng này giúp router auto lấy basename
    serializer_class = DiaryImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DiaryImage.objects.filter(diary_entry__user=self.request.user)

