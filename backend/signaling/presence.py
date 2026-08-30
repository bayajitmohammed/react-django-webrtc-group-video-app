from django.core.cache import cache

_KEY_PREFIX = 'signaling:presence:'


def _key(room_slug):
    return f'{_KEY_PREFIX}{room_slug}'


def add_participant(room_slug, channel_name, user_id, display_name):
    participants = cache.get(_key(room_slug)) or {}
    participants[channel_name] = {'user_id': user_id, 'display_name': display_name}
    cache.set(_key(room_slug), participants)
    return participants


def remove_participant(room_slug, channel_name):
    participants = cache.get(_key(room_slug)) or {}
    participants.pop(channel_name, None)
    if participants:
        cache.set(_key(room_slug), participants)
    else:
        cache.delete(_key(room_slug))
    return participants
