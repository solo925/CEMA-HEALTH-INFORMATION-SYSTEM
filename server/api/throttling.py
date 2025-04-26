from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BurstRateThrottle(UserRateThrottle):
    """
    Throttle that allows for a higher rate of requests in a short period of time.
    Used for API endpoints that might require burst access.
    """
    scope = 'burst'
    rate = '60/minute'  # Default, can be overridden in settings

class StandardRateThrottle(UserRateThrottle):
    """
    Throttle for regular API endpoints with standard access patterns.
    """
    scope = 'standard'
    rate = '1000/day'  # Default, can be overridden in settings

class SearchRateThrottle(UserRateThrottle):
    """
    Specific throttle for search operations to prevent abuse.
    """
    scope = 'search'
    rate = '5/second'  # Default, can be overridden in settings

class StrictIPRateThrottle(AnonRateThrottle):
    """
    Stricter throttle for anonymous users based on IP address.
    Used to protect public endpoints from abuse.
    """
    scope = 'strict_ip'
    rate = '20/minute'  # Default, can be overridden in settings

