from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer
from api.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Gửi email chào mừng ngay khi tạo xong
        if user.user_email:
            subject = "🎉 Chào mừng bạn đến với Freigeist!"
            message = f"""Xin chào {user.user_fullname},

Chúc mừng bạn đã gia nhập Freigeist! 🎉

Tại đây, bạn có thể lưu giữ cảm xúc, suy nghĩ và những khoảnh khắc quý giá mỗi ngày.

Hy vọng bạn sẽ có được những trãi nghiệm tốt nhất.

- Đội ngũ Freigeist
"""
            try:
                send_mail(
                    subject,
                    message,
                    'your_email@gmail.com',  # Email gửi đi (SMTP đã cấu hình trong settings.py)
                    [user.user_email],
                    fail_silently=False
                )
                print(f"✅ Email chào mừng đã gửi tới {user.user_email}")
            except Exception as e:
                print(f"❌ Lỗi gửi email chào mừng: {e}")

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('user_email', '').lower()
        password = request.data.get('password')


        try:
            user = User.objects.get(user_email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": f"Email '{email}' does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({"detail": "Incorrect email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.user_isBlocked:
            return Response({"detail": "User is blocked"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.user_email,
                "user_fullname": user.user_fullname,
                "user_avatarUrl": user.user_avatarUrl,
                "user_dob": user.user_dob,
                "user_gender": user.user_gender,
                "user_createAt": user.user_createAt,
                "user_interests": user.user_interests,
            }
        })
    


class LogoutView(APIView):
    permission_classes = [AllowAny] # Không yêu cầu token luôn nếu muốn

    def post(self, request):
        # Không cần làm gì cả — chỉ cần xoá token ở frontend là đủ
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)



