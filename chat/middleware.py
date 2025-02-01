from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    return User.objects.get(id=user_id)

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope['query_string'].decode()
        query_params = dict(qc.split('=') for qc in query_string.split('&') if '=' in qc)

        token = query_params.get("token", None)
        if token is None:
            await self.reject_conntection(send, 'Missing token.')
            return
        try:
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_data.get("user_id", None)
            if user_id is not None:
                scope['user'] = await get_user(user_id)
            else:
                await self.reject_connection(send, "Invalid token.")
                return
        except (InvalidToken, TokenError):
            await self.reject_connection(send, "Token error.")
            return
        return await super().__call__(scope, receive, send)

    async def reject_conntection(self, send, message):
        await send({
            "type": "websocket.close",
            "code": 4001,
            "reason": message,
        })
