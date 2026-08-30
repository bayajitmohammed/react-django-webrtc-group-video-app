from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.core.exceptions import ValidationError

from main.models import Room

from . import presence


class SignalingConsumer(AsyncJsonWebsocketConsumer):
    """WebRTC signaling relay + presence for a single room.

    Protocol (JSON messages):
    - server -> client, on connect: {"type": "room_state", "participants": [...]}
    - server -> client: {"type": "peer_joined", "user_id", "display_name"}
    - server -> client: {"type": "peer_left", "user_id"}
    - client -> server: {"type": "signal", "to": <user_id>, "data": <sdp/ice payload>}
    - server -> client: {"type": "signal", "from": <user_id>, "data": <sdp/ice payload>}
    - client -> server: {"type": "chat", "message": <str>}
    - server -> client: {"type": "chat", "from", "display_name", "message"}
    """

    async def connect(self):
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.user = self.scope['user']
        self.group_name = f'room_{self.room_slug}'

        if not self.user.is_authenticated:
            await self.close(code=4401)
            return

        room = await self._get_room()
        if room is None:
            await self.close(code=4404)
            return

        if not self._can_join(room):
            await self.close(code=4403)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        display_name = self.user.get_full_name() or self.user.email
        participants = await database_sync_to_async(presence.add_participant)(
            self.room_slug, self.channel_name, self.user.id, display_name,
        )
        await self.send_json({
            'type': 'room_state',
            'participants': [
                {'user_id': p['user_id'], 'display_name': p['display_name']}
                for channel, p in participants.items()
                if channel != self.channel_name
            ],
        })

        await self.channel_layer.group_send(self.group_name, {
            'type': 'peer.joined',
            'sender_channel': self.channel_name,
            'user_id': self.user.id,
            'display_name': display_name,
        })

    async def disconnect(self, close_code):
        if not getattr(self, 'group_name', None):
            return

        await database_sync_to_async(presence.remove_participant)(self.room_slug, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_send(self.group_name, {
            'type': 'peer.left',
            'sender_channel': self.channel_name,
            'user_id': self.user.id,
        })

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')

        if message_type == 'signal':
            await self._relay_signal(content)
        elif message_type == 'chat':
            await self._relay_chat(content)

    async def _relay_signal(self, content):
        to_user_id = content.get('to')
        if to_user_id is None:
            return

        await self.channel_layer.group_send(self.group_name, {
            'type': 'peer.signal',
            'sender_channel': self.channel_name,
            'from_user_id': self.user.id,
            'to_user_id': to_user_id,
            'data': content.get('data'),
        })

    async def _relay_chat(self, content):
        await self.channel_layer.group_send(self.group_name, {
            'type': 'peer.chat',
            'sender_channel': self.channel_name,
            'from_user_id': self.user.id,
            'display_name': self.user.get_full_name() or self.user.email,
            'message': content.get('message', ''),
        })

    # Group event handlers - dispatched by the channel layer, method name derived
    # from `type` ("peer.joined" -> `peer_joined`).

    async def peer_joined(self, event):
        if event['sender_channel'] == self.channel_name:
            return
        await self.send_json({
            'type': 'peer_joined',
            'user_id': event['user_id'],
            'display_name': event['display_name'],
        })

    async def peer_left(self, event):
        if event['sender_channel'] == self.channel_name:
            return
        await self.send_json({'type': 'peer_left', 'user_id': event['user_id']})

    async def peer_signal(self, event):
        if event['to_user_id'] != self.user.id:
            return
        await self.send_json({
            'type': 'signal',
            'from': event['from_user_id'],
            'data': event['data'],
        })

    async def peer_chat(self, event):
        if event['sender_channel'] == self.channel_name:
            return
        await self.send_json({
            'type': 'chat',
            'from': event['from_user_id'],
            'display_name': event['display_name'],
            'message': event['message'],
        })

    @database_sync_to_async
    def _get_room(self):
        try:
            return Room.objects.filter(slug=self.room_slug).select_related('owner').first()
        except (ValueError, ValidationError):
            return None

    def _can_join(self, room):
        if room.room_type == Room.RoomType.OPEN_TO_ALL:
            return True
        return room.owner_id == self.user.id
