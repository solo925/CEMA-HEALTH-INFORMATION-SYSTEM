from django.test import TestCase
from api.models import HealthProgram, Client, Enrollment
from django.utils import timezone
import uuid
from datetime import timedelta

class HealthProgramModelTests(TestCase):
    """Test cases for the HealthProgram model"""
    
    def setUp(self):
        self.program_data = {
            'name': 'Malaria Prevention',
            'description': 'Program for malaria prevention and awareness',
            'start_date': timezone.now().date(),
            'end_date': (timezone.now() + timedelta(days=30)).date(),
            'status': 'active',
            'capacity': 100
        }
        
    def test_create_program(self):
        """Test creating a health program"""
        program = HealthProgram.objects.create(**self.program_data)
        self.assertEqual(program.name, self.program_data['name'])
        self.assertEqual(program.description, self.program_data['description'])
        self.assertEqual(program.status, self.program_data['status'])
        self.assertEqual(program.capacity, self.program_data['capacity'])
        self.assertTrue(isinstance(program.id, uuid.UUID))
        
    def test_enrolled_clients_count(self):
        """Test the enrolled_clients_count property"""
        program = HealthProgram.objects.create(**self.program_data)
        
        # Create clients and enroll them
        client1 = Client.objects.create(
            first_name='John',
            last_name='Doe',
            date_of_birth=timezone.now().date() - timedelta(days=365*30),
            gender='male',
            contact_number='1234567890',
            email='john@example.com',
            address='123 Main St',
            emergency_contact='0987654321'
        )
        
        client2 = Client.objects.create(
            first_name='Jane',
            last_name='Smith',
            date_of_birth=timezone.now().date() - timedelta(days=365*25),
            gender='female',
            contact_number='9876543210',
            email='jane@example.com',
            address='456 Oak Ave',
            emergency_contact='0123456789'
        )
        
        # Create enrollments
        Enrollment.objects.create(
            client=client1,
            program=program,
            enrollment_date=timezone.now().date(),
            status='active'
        )
        
        Enrollment.objects.create(
            client=client2,
            program=program,
            enrollment_date=timezone.now().date(),
            status='active'
        )
        
        # Check enrolled clients count
        self.assertEqual(program.enrolled_clients_count, 2)
        
        # Test after removing an enrollment
        Enrollment.objects.filter(client=client1, program=program).delete()
        # Refresh from db to reset cached properties
        program = HealthProgram.objects.get(id=program.id)
        self.assertEqual(program.enrolled_clients_count, 1)


class ClientModelTests(TestCase):
    """Test cases for the Client model"""
    
    def setUp(self):
        self.client_data = {
            'first_name': 'Robert',
            'last_name': 'Johnson',
            'date_of_birth': timezone.now().date() - timedelta(days=365*40),
            'gender': 'male',
            'contact_number': '5551234567',
            'email': 'robert@example.com',
            'address': '789 Pine St',
            'emergency_contact': '5559876543'
        }
        
    def test_create_client(self):
        """Test creating a client"""
        client = Client.objects.create(**self.client_data)
        self.assertEqual(client.first_name, self.client_data['first_name'])
        self.assertEqual(client.last_name, self.client_data['last_name'])
        self.assertEqual(client.email, self.client_data['email'])
        self.assertTrue(isinstance(client.id, uuid.UUID))
        self.assertIsNotNone(client.registration_date)
        
    def test_get_active_programs(self):
        """Test the get_active_programs method"""
        client = Client.objects.create(**self.client_data)
        
        # Create programs
        active_program = HealthProgram.objects.create(
            name='HIV Testing',
            description='HIV testing and counseling',
            start_date=timezone.now().date(),
            status='active'
        )
        
        completed_program = HealthProgram.objects.create(
            name='TB Screening',
            description='TB screening and treatment',
            start_date=timezone.now().date() - timedelta(days=60),
            end_date=timezone.now().date() - timedelta(days=30),
            status='completed'
        )
        
        # Enroll client in both programs
        Enrollment.objects.create(
            client=client,
            program=active_program,
            enrollment_date=timezone.now().date(),
            status='active'
        )
        
        Enrollment.objects.create(
            client=client,
            program=completed_program,
            enrollment_date=timezone.now().date() - timedelta(days=50),
            status='completed'
        )
        
        # Test get_active_programs
        active_programs = client.get_active_programs()
        self.assertEqual(active_programs.count(), 1)
        self.assertEqual(active_programs.first().id, active_program.id)
