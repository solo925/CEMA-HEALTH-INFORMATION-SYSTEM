# api/authentication.py - Create this file
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import AuthToken

class TokenAuthentication(BaseAuthentication):
    """Simple token-based authentication"""
    
    def authenticate(self, request):
        # Get the token from the Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        if not token:
            return None
            
        # Find the token in the database
        try:
            auth_token = AuthToken.objects.get(key=token)
            return (auth_token.user, auth_token)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed('Invalid token')