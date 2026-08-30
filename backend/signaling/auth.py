from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError


@database_sync_to_async
def _authenticate(token):
    try:
        auth = JWTAuthentication()
        validated_token = auth.get_validated_token(token)
        return auth.get_user(validated_token)
    except (TokenError, AuthenticationFailed):
        return AnonymousUser()


class JWTAuthMiddleware:
    """Authenticates websocket connections via a `?token=<access token>` query param.

    Runs before `connect()`, so an invalid/missing token never reaches the consumer
    as an authenticated-looking scope - the consumer just sees AnonymousUser and closes.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        scope['user'] = await _authenticate(token) if token else AnonymousUser()
        return await self.app(scope, receive, send)
