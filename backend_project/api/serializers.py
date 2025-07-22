from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    User, DiaryEntry, DiaryImage,
    Tag, DiaryTag,
    Reminder,
    Feedback, FeedbackType,
    Response
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super().create(validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class DiaryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryImage
        fields = ['id', 'di_imageUrl', 'diary_entry']  

class DiaryTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryTag
        fields = '__all__'

# class DiaryEntrySerializer(serializers.ModelSerializer):
#     images = DiaryImageSerializer(many=True, read_only=True)
#     tags = TagSerializer(many=True, read_only=True)

#     class Meta:
#         model = DiaryEntry
#         fields = '__all__'

class DiaryEntrySerializer(serializers.ModelSerializer):
    tags = serializers.ListField(write_only=True)
    images = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = DiaryEntry
        fields = [
            "id", "user", "de_title", "de_date", "de_content",
            "de_emoState", "de_emoScore", 'de_advice', "tags", "images"
        ]
        read_only_fields = ['user', 'de_emoState', 'de_emoScore', 'de_advice']  


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'

class FeedbackTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackType
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'
