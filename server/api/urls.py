from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthProgramViewSet, ClientViewSet,RegisterView,LoginView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
# from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'programs', HealthProgramViewSet)
router.register(r'clients', ClientViewSet)

# Schema view for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Health Information System API",
        default_version='v1',
        description="API for managing health programs and clients",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@yourapp.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    

    # Authentication endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
