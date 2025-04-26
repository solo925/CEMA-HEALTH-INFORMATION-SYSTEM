from rest_framework import serializers
from .models import User, HealthProgram, Client, Enrollment
from django.utils import timezone
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff')
        read_only_fields = ('id', 'is_staff')


class HealthProgramSerializer(serializers.ModelSerializer):
    """Serializer for HealthProgram model"""
    enrolled_clients = serializers.IntegerField(source='enrolled_clients_count', read_only=True)
    
    class Meta:
        model = HealthProgram
        fields = ('id', 'name', 'description', 'start_date', 'end_date', 
                 'status', 'capacity', 'enrolled_clients', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate(self, data):
        """Validate program data"""
        # Ensure end_date is after start_date if provided
        if 'end_date' in data and data['end_date'] and data['start_date']:
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError("End date must be after start date")
        
        # If status is 'completed', ensure end_date is provided
        if data.get('status') == 'completed' and not data.get('end_date'):
            raise serializers.ValidationError("End date is required for completed programs")
            
        return data


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for the Enrollment model"""
    program_id = serializers.UUIDField(source='program.id', read_only=True)
    enrollment_date = serializers.DateField(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ('program_id', 'enrollment_date', 'status')


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model"""
    programs = EnrollmentSerializer(source='enrollments', many=True, read_only=True)
    
    class Meta:
        model = Client
        fields = ('id', 'first_name', 'last_name', 'date_of_birth', 'gender',
                 'contact_number', 'email', 'address', 'emergency_contact',
                 'registration_date', 'programs', 'created_at', 'updated_at')
        read_only_fields = ('id', 'registration_date', 'created_at', 'updated_at')


class ClientEnrollmentSerializer(serializers.Serializer):
    """Serializer for enrolling a client in a program"""
    program_id = serializers.UUIDField()
    
    def validate_program_id(self, value):
        """Validate the program exists and is not completed"""
        try:
            program = HealthProgram.objects.get(id=value)
            if program.status == 'completed':
                raise serializers.ValidationError("Cannot enroll in a completed program")
                
            # Check if program has reached capacity
            if program.capacity and program.enrolled_clients_count >= program.capacity:
                raise serializers.ValidationError("Program has reached maximum capacity")
            
            return value
        except HealthProgram.DoesNotExist:
            raise serializers.ValidationError("Invalid program ID")
    
    @transaction.atomic
    def create(self, validated_data):
        """Create a new enrollment"""
        client = self.context['client']
        program_id = validated_data['program_id']
        program = HealthProgram.objects.get(id=program_id)
        
        # Check if client is already enrolled
        if Enrollment.objects.filter(client=client, program=program).exists():
            raise serializers.ValidationError("Client is already enrolled in this program")
        
        # Create enrollment
        enrollment = Enrollment.objects.create(
            client=client,
            program=program,
            enrollment_date=timezone.now().date(),
            status='active'
        )
        
        return enrollment