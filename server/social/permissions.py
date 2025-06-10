from rest_framework.permissions import BasePermission
from jose import jwt
import requests
from django.conf import settings

class IsAuthenticatedWithAuth0(BasePermission):
    def has_permission(self, request, view):
        auth = request.headers.get("Authorization", None)
        if not auth:
            return False

        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return False

        token = parts[1]

        try:
            # Récupère les clés publiques JWKS depuis Auth0
            jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
            jwks = requests.get(jwks_url).json()
            unverified_header = jwt.get_unverified_header(token)

            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }

            if rsa_key:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=["RS256"],
                    audience=settings.AUTH0_AUDIENCE,
                    issuer=f"https://{settings.AUTH0_DOMAIN}/"
                )

                # Ajouter le user_sub au request
                request.user_sub = payload["sub"]
                return True

        except Exception as e:
            print("Auth0 JWT Error:", str(e))
            return False

        return False
