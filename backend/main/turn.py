import base64
import hashlib
import hmac
import time

from django.conf import settings

CREDENTIAL_TTL_SECONDS = 3600


def build_turn_credentials():
    expires_at = int(time.time()) + CREDENTIAL_TTL_SECONDS
    username = str(expires_at)
    digest = hmac.new(settings.TURN_SECRET.encode(), username.encode(), hashlib.sha1).digest()
    credential = base64.b64encode(digest).decode()
    urls = [url.strip() for url in settings.TURN_URLS.split(',') if url.strip()]

    return {
        'username': username,
        'credential': credential,
        'ttl': CREDENTIAL_TTL_SECONDS,
        'urls': urls,
    }
