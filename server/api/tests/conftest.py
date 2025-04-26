import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Client, HealthProgram, Enrollment
from django.utils import timezone
from datetime import timedelta
import uuid

User = get_user_model()

@pytest.fixture
def api_client():
    """Returns an API client for testing."""
    return APIClient()

@pytest.fixture
def user_admin():
    """Creates and returns an admin user for testing."""
    email = "admin@example.com"
    password = "adminpassword123"
    user = User.objects.create_superuser(email=email, password=password, first_name="Admin", last_name="User")
    return user

@pytest.fixture
def user_doctor():
    """Creates and returns a regular doctor user for testing."""
    email = "doctor@example.com"
    password = "doctorpassword123"
    user = User.objects.create_user(email=email, password=password, first_name="Doctor", last_name="User")
    return user

@pytest.fixture
def authenticated_admin_client(api_client, user_admin):
    """Returns an API client authenticated as admin."""
    api_client.force_authenticate(user=user_admin)
    return api_client

@pytest.fixture
def authenticated_doctor_client(api_client, user_doctor):
    """Returns an API client authenticated as doctor."""
    api_client.force_authenticate(user=user_doctor)
    return api_client

@pytest.fixture
def health_program():
    """Creates and returns a health program for testing."""
    program = HealthProgram.objects.create(
        name="Test Program",
        description="This is a test program for testing purposes",
        start_date=timezone.now().date() + timedelta(days=10),
        end_date=timezone.now().date() + timedelta(days=100),
        status="active",
        capacity=50
    )
    return program

@pytest.fixture
def completed_program():
    """Creates and returns a completed health program for testing."""
    program = HealthProgram.objects.create(
        name="Completed Program",
        description="This is a completed test program",
        start_date=timezone.now().date() - timedelta(days=100),
        end_date=timezone.now().date() - timedelta(days=10),
        status="completed"
    )
    return program

@pytest.fixture
def client_object():
    """Creates and returns a client for testing."""
    client = Client.objects.create(
        first_name="Test",
        last_name="Client",
        date_of_birth=timezone.now().date() - timedelta(days=365*30),
        gender="male",
        contact_number="1234567890",
        email="testclient@example.com",
        address="123 Test Street",
        emergency_contact="0987654321"
    )
    return client

@pytest.fixture
def enrolled_client(client_object, health_program):
    """Creates a client enrolled in a program."""
    enrollment = Enrollment.objects.create(
        client=client_object,
        program=health_program,
        enrollment_date=timezone.now().date(),
        status="active"
    )
    return client_object
