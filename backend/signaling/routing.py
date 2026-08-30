from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/rooms/(?P<room_slug>[0-9a-fA-F-]+)/$', consumers.SignalingConsumer.as_asgi()),
]
