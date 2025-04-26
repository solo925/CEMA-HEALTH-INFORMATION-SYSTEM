from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import HealthProgram, Client, Enrollment
from .serializers import (
    HealthProgramSerializer, ClientSerializer, 
    EnrollmentSerializer, ClientEnrollmentSerializer
)
from .permissions import IsAuthenticated
from .pagination import StandardResultsSetPagination
from .filters import ClientFilter, ProgramFilter
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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