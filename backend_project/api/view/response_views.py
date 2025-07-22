from rest_framework import viewsets #noqa
from api.models import Response
from ..serializers import ResponseSerializer

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
