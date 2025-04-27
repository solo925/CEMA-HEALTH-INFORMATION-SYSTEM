from rest_framework import viewsets, permissions, status, filters,generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import HealthProgram, Client, Enrollment
from .serializers import (
    HealthProgramSerializer, ClientSerializer, 
    EnrollmentSerializer, ClientEnrollmentSerializer
)
from rest_framework import status, views, permissions
from .permissions import IsAuthenticated
from .pagination import StandardResultsSetPagination
from .filters import ClientFilter, ProgramFilter
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import UserRegistrationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import json

# from django.contrib.auth import get_user_model, authenticate
# from rest_framework import status, views, permissions
# from rest_framework.response import Response
from .models import AuthToken
from .serializers import UserSerializer

User = get_user_model()

class HealthProgramViewSet(viewsets.ModelViewSet):
    """ViewSet for managing health programs"""
    queryset = HealthProgram.objects.all()
    serializer_class = HealthProgramSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProgramFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'start_date', 'status', 'created_at']
    
    @swagger_auto_schema(
        operation_description="Get all clients enrolled in a specific program",
        responses={200: ClientSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def clients(self, request, pk=None):
        """Get all clients enrolled in this program"""
        program = self.get_object()
        clients = program.clients.all()
        
        page = self.paginate_queryset(clients)
        if page is not None:
            serializer = ClientSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)


class ClientViewSet(viewsets.ModelViewSet):
    """ViewSet for managing clients"""
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ClientFilter
    search_fields = ['first_name', 'last_name', 'email', 'contact_number']
    ordering_fields = ['first_name', 'last_name', 'registration_date', 'created_at']
    
    @swagger_auto_schema(
        operation_description="Search for clients by name, email, or contact number",
        manual_parameters=[
            openapi.Parameter(
                'query', openapi.IN_QUERY, 
                description="Search term", 
                type=openapi.TYPE_STRING
            )
        ],
        responses={200: ClientSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search for clients by name, email, or contact number"""
        query = request.query_params.get('query', '')
        if not query:
            return Response(
                {"detail": "Please provide a search query"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        clients = Client.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query) |
            Q(contact_number__icontains=query)
        )
        
        page = self.paginate_queryset(clients)
        if page is not None:
            serializer = ClientSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Enroll a client in a health program",
        request_body=ClientEnrollmentSerializer,
        responses={
            201: EnrollmentSerializer,
            400: "Bad request"
        }
    )
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Enroll a client in a health program"""
        client = self.get_object()
        serializer = ClientEnrollmentSerializer(
            data=request.data,
            context={'client': client}
        )
        
        if serializer.is_valid():
            enrollment = serializer.save()
            response_serializer = EnrollmentSerializer(enrollment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class RegisterView(generics.CreateAPIView):
    """View for user registration"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Return a success response
            return Response({
                "message": "User registered successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    
#     username_field = User.USERNAME_FIELD  # This should be 'email' based on your User model

#     def validate(self, attrs):
#         # Extract credentials
#         credentials = {
#             self.username_field: attrs.get('email'),
#             'password': attrs.get('password'),
#         }

#         # Authenticate user
#         user = authenticate(**credentials)
#         if user is None:
#             raise serializers.ValidationError(
#                 'No active account found with the given credentials'
#             )

#         # Get token and add user data
#         data = super().validate(attrs)
#         data['user'] = UserSerializer(user).data
        
#         return data

# class EmailTokenObtainPairView(TokenObtainPairView):
#     serializer_class = EmailTokenObtainPairSerializer
    
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
        
#         try:
#             serializer.is_valid(raise_exception=True)
#         except serializers.ValidationError as e:
#             return Response(
#                 {'detail': 'Invalid credentials'},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )
            
#         return Response(serializer.validated_data, status=status.HTTP_200_OK)
class RegisterView(generics.CreateAPIView):
    """View for user registration"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create or get auth token
            token, created = Token.objects.get_or_create(user=user)
            
            # Return a success response with token
            return Response({
                "message": "User registered successfully",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    """Simple login view using Django's built-in authentication"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'detail': 'Both email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authenticate user
        if not user.check_password(password):
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create or get auth token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user data
        user_data = UserSerializer(user).data
        
        # Success response
        return Response({
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_200_OK)