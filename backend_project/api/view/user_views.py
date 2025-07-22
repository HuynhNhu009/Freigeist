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

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

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


# class LogoutView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             refresh_token = request.data.get("refresh_token")
#             token = RefreshToken(refresh_token)
#             token.blacklist()  # đưa vào danh sách đen
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response(status=status.HTTP_400_BAD_REQUEST)
