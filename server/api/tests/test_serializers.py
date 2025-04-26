import pytest
from django.utils import timezone
from datetime import timedelta
from api.serializers import (
    HealthProgramSerializer,
    ClientSerializer,
    EnrollmentSerializer,
    ClientEnrollmentSerializer
)
from api.models import HealthProgram, Client, Enrollment

pytestmark = pytest.mark.django_db

class TestHealthProgramSerializer:
    """Test cases for the HealthProgramSerializer."""
    
    def test_valid_data(self):
        """Test serializer with valid data."""
        data = {
            'name': 'New Program',
            'description': 'New program description',
            'start_date': (timezone.now().date() + timedelta(days=5)).isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=30)).isoformat(),
            'status': 'planned',
            'capacity': 100
        }
        
        serializer = HealthProgramSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        program = serializer.save()
        
        assert program.name == data['name']
        assert program.description == data['description']
        assert program.status == data['status']
        assert program.capacity == data['capacity']
    
    def test_end_date_before_start_date(self):
        """Test serializer with end date before start date (should fail)."""
        data = {
            'name': 'Invalid Program',
            'description': 'Program with invalid dates',
            'start_date': (timezone.now().date() + timedelta(days=30)).isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=5)).isoformat(),
            'status': 'planned',
        }
        
        serializer = HealthProgramSerializer(data=data)
        assert not serializer.is_valid()
        assert 'End date must be after start date' in str(serializer.errors)
    
    def test_completed_without_end_date(self):
        """Test serializer with completed status but no end date (should fail)."""
        data = {
            'name': 'Completed Program',
            'description': 'Completed program without end date',
            'start_date': (timezone.now().date() - timedelta(days=30)).isoformat(),
            'status': 'completed',
        }
        
        serializer = HealthProgramSerializer(data=data)
        assert not serializer.is_valid()
        assert 'End date is required for completed programs' in str(serializer.errors)

class TestClientSerializer:
    """Test cases for the ClientSerializer."""
    
    def test_valid_data(self):
        """Test serializer with valid data."""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': (timezone.now().date() - timedelta(days=365*25)).isoformat(),
            'gender': 'male',
            'contact_number': '9876543210',
            'email': 'john.doe@example.com',
            'address': '456 Main St',
            'emergency_contact': '1234567890',
        }
        
        serializer = ClientSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        client = serializer.save()
        
        assert client.first_name == data['first_name']
        assert client.last_name == data['last_name']
        assert client.email == data['email']
        
        # Check auto-generated fields
        assert client.registration_date is not None
    
    def test_programs_field(self, client_object, health_program):
        """Test that programs field is included in serialized output."""
        # Create enrollment
        enrollment = Enrollment.objects.create(
            client=client_object,
            program=health_program,
            enrollment_date=timezone.now().date(),
            status="active"
        )
        
        serializer = ClientSerializer(client_object)
        assert 'programs' in serializer.data
        assert len(serializer.data['programs']) == 1
        assert serializer.data['programs'][0]['program_id'] == str(health_program.id)

class TestClientEnrollmentSerializer:
    """Test cases for the ClientEnrollmentSerializer."""
    
    def test_valid_enrollment(self, client_object, health_program):
        """Test enrolling a client in a program."""
        data = {
            'program_id': str(health_program.id)
        }
        
        serializer = ClientEnrollmentSerializer(
            data=data,
            context={'client': client_object}
        )
        
        assert serializer.is_valid(), serializer.errors
        enrollment = serializer.save()
        
        assert enrollment.client == client_object
        assert enrollment.program == health_program
        assert enrollment.status == 'active'
    
    def test_invalid_program_id(self, client_object):
        """Test enrollment with invalid program ID."""
        data = {
            'program_id': str(uuid.uuid4())  # Random non-existent ID
        }
        
        serializer = ClientEnrollmentSerializer(
            data=data,
            context={'client': client_object}
        )
        
        assert not serializer.is_valid()
        assert 'Invalid program ID' in str(serializer.errors)
    
    def test_completed_program(self, client_object, completed_program):
        """Test enrollment in a completed program (should fail)."""
        data = {
            'program_id': str(completed_program.id)
        }
        
        serializer = ClientEnrollmentSerializer(
            data=data,
            context={'client': client_object}
        )
        
        assert not serializer.is_valid()
        assert 'Cannot enroll in a completed program' in str(serializer.errors)
    
    def test_duplicate_enrollment(self, enrolled_client, health_program):
        """Test enrolling a client in a program they're already enrolled in (should fail)."""
        data = {
            'program_id': str(health_program.id)
        }
        
        serializer = ClientEnrollmentSerializer(
            data=data,
            context={'client': enrolled_client}
        )
        
        # Initial validation should pass
        assert serializer.is_valid(), serializer.errors
        
        # But saving should fail due to unique constraint
        with pytest.raises(Exception) as excinfo:
            serializer.save()
        
        assert 'already enrolled' in str(excinfo.value)
