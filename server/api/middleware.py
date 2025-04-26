from django.http import HttpResponseForbidden
import re

class SecurityMiddleware:
    """
    Middleware to implement additional security measures.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Check for suspicious SQL injection patterns in request parameters
        for param, value in request.GET.items():
            if isinstance(value, str) and self._contains_sql_injection(value):
                return HttpResponseForbidden("Forbidden")
                
        # Add additional security headers
        response = self.get_response(request)
        response["X-Content-Type-Options"] = "nosniff"
        response["X-Frame-Options"] = "DENY"
        response["X-XSS-Protection"] = "1; mode=block"
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Set Content Security Policy
        csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
        response["Content-Security-Policy"] = csp
        
        return response
        
    def _contains_sql_injection(self, value):
        """Check for common SQL injection patterns"""
        sql_patterns = [
            r"(?i)(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b)",
            r"(?i)(\b(FROM|WHERE|ORDER BY|GROUP BY)\b)",
            r"(?i)((\-\-|\#|\/\*))",
            r"(?i)((\bOR\b|\bAND\b)[\s\'\"\`]+[0-9a-zA-Z]+[\s\'\"\`]+\=[\s\'\"\`])",
        ]
        
        for pattern in sql_patterns:
            if re.search(pattern, value):
                return True
                
        return False
