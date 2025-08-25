from rest_framework import generics
from django.core.mail import send_mail

from api.serializers_admin import AdminDiaryEntrySerializer, AdminFeedbackSerializer, AdminResponseSerializer 
from ..permissions import IsSuperUser
from api.models import DiaryEntry, Feedback, Response, User
from ..serializers import UserSerializer


class AdminUserListAPI(generics.ListAPIView):
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = UserSerializer

class AdminDiaryListAPI(generics.ListAPIView):
    queryset = DiaryEntry.objects.all()
    serializer_class = AdminDiaryEntrySerializer
    permission_classes = [IsSuperUser]

class AdminFeedbackListAPI(generics.ListAPIView):
    queryset = Feedback.objects.all()
    serializer_class = AdminFeedbackSerializer
    permission_classes = [IsSuperUser]

# class AdminResponseListAPI(generics.ListAPIView):
#     queryset = Response.objects.all()
#     serializer_class = AdminResponseSerializer
#     permission_classes = [IsSuperUser]

class AdminResponseListAPI(generics.ListCreateAPIView):
    queryset = Response.objects.all()
    serializer_class = AdminResponseSerializer
    permission_classes = [IsSuperUser]

    def perform_create(self, serializer):
        feedback_id = self.request.data.get('feedback')
        response = serializer.save(feedback_id=feedback_id)

        # Cập nhật trạng thái feedback thành đã xử lý
        feedback = Feedback.objects.get(id=feedback_id)
        feedback.fe_isResolve = True
        feedback.save()

        # Lấy email người dùng
        user_email = feedback.user.user_email

        # Gửi email thông báo phản hồi
        if user_email:
            subject = f"📩 Phản hồi cho góp ý: {feedback.fe_title}"
            message = f"""Xin chào {feedback.user.user_fullname},

Cảm ơn bạn đã gửi góp ý cho chúng tôi.

Phản hồi từ hệ thống:
{response.re_content}

- Đội ngũ Freigeist
"""
            try:
                send_mail(
                    subject,
                    message,
                    'your_email@gmail.com',  # Email gửi đi
                    [user_email],
                    fail_silently=False
                )
                print(f"✅ Email phản hồi đã gửi tới {user_email}")
            except Exception as e:
                print(f"❌ Lỗi gửi email phản hồi: {e}")