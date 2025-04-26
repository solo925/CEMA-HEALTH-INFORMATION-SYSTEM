from rest_framework import permissions

class IsAuthenticated(permissions.BasePermission):
    """
    Custom permission class that ensures the user is authenticated
    and active.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_active
        )