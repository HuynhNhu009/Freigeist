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
# class DiaryImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DiaryImage
#         fields = ['id', 'di_imageUrl', 'diary_entry']  

#         def get_image_url(self, obj):
#             return obj.image.url  # 🔁 nếu field là 'image'

# from rest_framework import serializers
# from api.models import DiaryImage

class DiaryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryImage
        fields = ['id', 'di_imageUrl', 'diary_entry']

    def create(self, validated_data):
        try:
            instance = super().create(validated_data)
            return instance
        except Exception as e:
            print("❌ Upload ảnh lên Cloudinary thất bại:", e)
            raise e  # Giữ nguyên để client cũng thấy lỗi

    # Tuỳ chọn nếu bạn cần hiển thị URL:
    def get_image_url(self, obj):
        if obj.di_imageUrl:
            try:
                return obj.di_imageUrl.url
            except Exception as e:
                print("⚠️ Không lấy được URL ảnh:", e)
        return None


class DiaryTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryTag
        fields = '__all__'


    

class DiaryEntrySerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.IntegerField(),  # Truyền danh sách ID
        write_only=True
    )
    images = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = DiaryEntry
        fields = [
            "id", "user", "de_title", "de_date", "de_content",
            "de_emoState", "de_emoScore", 'de_advice', "tags", "images"
        ]
        read_only_fields = [
            'user', 'de_emoState', 'de_emoScore', 'de_advice'
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["tags"] = [tag.tag_name for tag in instance.tags.all()]
        rep["images"] = [img.di_imageUrl.url for img in instance.images.all()]
        return rep


    # def create(self, validated_data):
    #     tags_data = validated_data.pop("tags", [])
    #     images_data = validated_data.pop("images", [])


    #     user = self.context['request'].user
    #     validated_data.pop("user", None)  # phòng trường hợp user có trong data

    #     diary = DiaryEntry.objects.create(user=user, **validated_data)

    #     for tag_name in tags_data:
    #         tag, created = Tag.objects.get_or_create(tag_name=tag_name)
    #         diary.tags.add(tag)

    #     return diary

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        images_data = validated_data.pop("images", [])

        user = self.context['request'].user
        validated_data.pop("user", None)  # phòng trường hợp user có trong data

        diary = DiaryEntry.objects.create(user=user, **validated_data)

        for tag_id in tags_data:
            tag = Tag.objects.get(id=tag_id)  # Lấy tag bằng id
            diary.tags.add(tag)

        return diary



class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
        read_only_fields = ['user']  # Không cần gửi từ frontend

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class FeedbackTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackType
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['user']

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'

