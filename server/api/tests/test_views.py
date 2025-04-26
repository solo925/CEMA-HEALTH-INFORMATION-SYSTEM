from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import User, HealthProgram, Client, Enrollment
from django.utils import timezone
from datetime import timedelta
import json
import uuid

class HealthProgramViewSetTests(APITestCase):
    """Test cases for the HealthProgramViewSet"""
    
    def setUp(self):
        # Create test user and authenticate
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test program
        self.program = HealthProgram.objects.create(
            name='COVID-19 Vaccination',
            description='COVID-19 vaccination campaign',
            start_date=timezone.now().date(),
            end_date=(timezone.now() + timedelta(days=90)).date(),
            status='active',
            capacity=1000
        )
        
        # URLs
        self.list_url = reverse('healthprogram-list')
        self.detail_url = reverse('healthprogram-detail', args=[self.program.id])
        
    def test_list_programs(self):
        """Test retrieving a list of health programs"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
    def test_create_program(self):
        """Test creating a new health program"""
        data = {
            'name': 'Prenatal Care',
            'description': 'Prenatal care program for pregnant women',
            'start_date': (timezone.now() + timedelta(days=30)).date().isoformat(),
            'status': 'planned',
            'capacity': 200
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(HealthProgram.objects.count(), 2)
        self.assertEqual(response.data['name'], data['name'])
        
    def test_retrieve_program(self):
        """Test retrieving a health program by ID"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(self.program.id))
        self.assertEqual(response.data['name'], self.program.name)
        
    def test_update_program(self):
        """Test updating a health program"""
        data = {
            'name': 'Updated COVID-19 Vaccination',
            'capacity': 2000
        }
        
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.program.refresh_from_db()
        self.assertEqual(self.program.name, data['name'])
        self.assertEqual(self.program.capacity, data['capacity'])
        
    def test_delete_program(self):
        """Test deleting a health program"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(HealthProgram.objects.count(), 0)
        
    def test_clients_action(self):
        """Test the 'clients' action to get all enrolled clients"""
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
        
        Enrollment.objects.create(
            client=client1,
            program=self.program,
            enrollment_date=timezone.now().date(),
            status='active'
        )
        
        # Test clients action
        url = reverse('healthprogram-clients', args=[self.program.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], str(client1.id))


class ClientViewSetTests(APITestCase):
    """Test cases for the ClientViewSet"""
    
    def setUp(self):
        # Create test user and authenticate
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test client
        self.test_client = Client.objects.create(
            first_name='Sarah',
            last_name='Jones',
            date_of_birth=timezone.now().date() - timedelta(days=365*35),
            gender='female',
            contact_number='5551234567',
            email='sarah@example.com',
            address='321 Oak St',
            emergency_contact='5559876543'
        )
        
        # Create test program
        self.program = HealthProgram.objects.create(
            name='Diabetes Management',
            description='Diabetes management and education',
            start_date=timezone.now().date(),
            status='active'
        )
        
        # URLs
        self.list_url = reverse('client-list')
        self.detail_url = reverse('client-detail', args=[self.test_client.id])
        self.search_url = reverse('client-search')
        self.enroll_url = reverse('client-enroll', args=[self.test_client.id])
        
    def test_list_clients(self):
        """Test retrieving a list of clients"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
    def test_create_client(self):
        """Test creating a new client"""
        data = {
            'first_name': 'Michael',
            'last_name': 'Brown',
            'date_of_birth': (timezone.now() - timedelta(days=365*45)).date().isoformat(),
            'gender': 'male',
            'contact_number': '5559876543',
            'email': 'michael@example.com',
            'address': '456 Elm St',
            'emergency_contact': '5551234567'
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Client.objects.count(), 2)
        self.assertEqual(response.data['first_name'], data['first_name'])
        
    def test_retrieve_client(self):
        """Test retrieving a client by ID"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(self.test_client.id))
        self.assertEqual(response.data['first_name'], self.test_client.first_name)
        
    def test_update_client(self):
        """Test updating a client"""
        data = {
            'first_name': 'Sarah Jane',
            'contact_number': '5551112222'
        }
        
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.test_client.refresh_from_db()
        self.assertEqual(self.test_client.first_name, data['first_name'])
        self.assertEqual(self.test_client.contact_number, data['contact_number'])
        
    def test_search_clients(self):
        """Test searching for clients"""
        # Create another client for testing search
        Client.objects.create(
            first_name='Sarah',
            last_name='Smith',
            date_of_birth=timezone.now().date() - timedelta(days=365*28),
            gender='female',
            contact_number='5553334444',
            email='sarahsmith@example.com',
            address='789 Pine St',
            emergency_contact='5556667777'
        )
        
        # Test search by first name
        response = self.client.get(f"{self.search_url}?query=Sarah")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Test search by email
        response = self.client.get(f"{self.search_url}?query=sarah@example")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_enroll_client(self):
        """Test enrolling a client in a program"""
        data = {
            'program_id': str(self.program.id)
        }
        
        response = self.client.post(self.enroll_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify enrollment was created
        enrollment = Enrollment.objects.filter(
            client=self.test_client, 
            program=self.program
        ).first()
        
        self.assertIsNotNone(enrollment)
        self.assertEqual(enrollment.status, 'active')
        
        # Test enrolling in the same program again (should fail)
        response = self.client.post(self.enroll_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)