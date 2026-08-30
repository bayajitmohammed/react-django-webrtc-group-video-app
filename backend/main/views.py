from django.http import JsonResponse
from rest_framework import generics, permissions, viewsets

from .models import Room
from .permissions import IsOwnerOrReadOnly
from .serializers import RegisterSerializer, RoomSerializer, UserSerializer


def ping(request):
    return JsonResponse({"status": "ok"})


class RegisterView(generics.CreateAPIView):
    queryset = None
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)
    lookup_field = 'slug'
    queryset = Room.objects.select_related('owner').all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
