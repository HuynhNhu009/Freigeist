# api/serializers_admin.py

from rest_framework import serializers
from .models import DiaryEntry, Feedback, Response, User


class AdminDiaryEntrySerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.user_email')
    user_dob = serializers.DateField(source='user.user_dob')

    class Meta:
        model = DiaryEntry
        fields = ['id', 'user_email', 'user_dob', 'de_date', 'de_emoScore']

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'user_email',
            'user_dob',
            'user_fullname',
            'is_superuser',
            'date_joined',
            'last_login',
        ]

    


class AdminFeedbackSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.user_email', read_only=True)
    feedback_type_name = serializers.CharField(source='feedback_type.ft_name', read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id',
            'user_email',
            'feedback_type_name',
            'fe_title',
            'fe_content',
            'fe_submitedAt',
            'fe_isResolve'
        ]

# serializers_admin.py
class AdminResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ['id', 'feedback', 're_content', 're_createAt', 're_isSent']
        read_only_fields = ['id', 're_createAt']

