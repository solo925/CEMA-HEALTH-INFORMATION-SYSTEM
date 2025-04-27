from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()

class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows login with email
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            # Try to fetch the user by email
            user = User.objects.get(email=email)
            
            # Check the password
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # No user with this email found
            return None
        
        # Wrong password
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None