import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache
import json

User = get_user_model()

class Auth0Authentication(BaseAuthentication):
    """
    Authentification Auth0 pour Django REST Framework
    """
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None
            
        try:
          
            token = auth_header.split(' ')[1]
            
          
            payload = self.verify_token(token)
            
            if payload:
               
                user = self.get_or_create_user(payload)
                return (user, token)
                
        except (IndexError, jwt.InvalidTokenError, jwt.ExpiredSignatureError):
            raise AuthenticationFailed('Token invalide')
            
        return None
    
    def verify_token(self, token):
        """
        Vérifie le token JWT avec Auth0
        """
        try:
           
            jwks = self.get_jwks()
            
            
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
                    break
            
            if rsa_key:
                
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=["RS256"],
                    audience=settings.AUTH0_CLIENT_ID,
                    issuer=f"https://{settings.AUTH0_DOMAIN}/"
                )
                return payload
                
        except Exception as e:
            print(f"Erreur de vérification du token: {e}")
            return None
            
        return None
    
    def get_jwks(self):
        """
        Récupère les clés publiques d'Auth0 (avec cache)
        """
        cache_key = f"auth0_jwks_{settings.AUTH0_DOMAIN}"
        jwks = cache.get(cache_key)
        
        if not jwks:
            try:
                response = requests.get(f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json")
                jwks = response.json()
               
                cache.set(cache_key, jwks, 3600)
            except Exception as e:
                print(f"Erreur lors de la récupération des JWKS: {e}")
                return None
                
        return jwks
    
    def get_or_create_user(self, payload):
        """
        Obtient ou crée un utilisateur basé sur le payload Auth0
        """
        auth0_id = payload.get('sub')
        email = payload.get('email')
        name = payload.get('name', '')
        
        if not auth0_id:
            raise AuthenticationFailed('ID utilisateur manquant dans le token')
        
        try:
           
            user = User.objects.get(auth0_id=auth0_id)
        except User.DoesNotExist:
            
            user = User.objects.create(
                auth0_id=auth0_id,
                email=email,
                username=email or auth0_id,
                first_name=name.split(' ')[0] if name else '',
                last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''
            )
        except AttributeError:
           
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=email,
                    username=email or auth0_id,
                    first_name=name.split(' ')[0] if name else '',
                    last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''
                )
        
        return user