
from rest_framework.permissions import BasePermission
import jwt
from django.conf import settings

class IsAuthenticatedWithAuth0(BasePermission):
    def has_permission(self, request, view):
        auth = request.headers.get("Authorization", None)
        if not auth:
            return False
        parts = auth.split()
        if parts[0].lower() != "bearer":
            return False
        token = parts[1]
        try:
            decoded = jwt.decode(
                token,
                options={"verify_signature": False},
                audience=settings.AUTH0_AUDIENCE,
                algorithms=["RS256"]
            )
            request.user.sub = decoded["sub"]
            return True
        except Exception:
            return False