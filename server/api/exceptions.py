from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
from rest_framework.response import Response
from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError

class ServiceUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = 'Service temporarily unavailable, please try again later.'
    default_code = 'service_unavailable'

class InvalidInput(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input data provided.'
    default_code = 'invalid_input'

class ResourceAlreadyExists(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Resource already exists.'
    default_code = 'resource_already_exists'

def custom_exception_handler(exc, context):
    """Custom exception handler for standardizing API responses"""
    
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # If response is already handled by DRF, customize it
    if response is not None:
        # Create a custom response format
        custom_response = {
            'success': False,
            'error': {
                'code': response.status_code,
                'message': response.data.get('detail', str(response.data))
                           if hasattr(response, 'data') else str(exc),
            }
        }
        
        # If there are additional validation errors, include them
        if hasattr(response, 'data') and isinstance(response.data, dict):
            errors = {}
            for key, value in response.data.items():
                if key != 'detail':
                    errors[key] = value
            
            if errors:
                custom_response['error']['fields'] = errors
        
        response.data = custom_response
        return response
    
    # Handle IntegrityError (e.g., unique constraint violations)
    if isinstance(exc, IntegrityError):
        error_data = {
            'success': False,
            'error': {
                'code': status.HTTP_409_CONFLICT,
                'message': 'Database integrity error. This could be due to a duplicate entry.',
            }
        }
        return Response(error_data, status=status.HTTP_409_CONFLICT)
    
    # Handle Django's ValidationError
    if isinstance(exc, ValidationError):
        error_data = {
            'success': False,
            'error': {
                'code': status.HTTP_400_BAD_REQUEST,
                'message': 'Validation error',
                'detail': exc.message if hasattr(exc, 'message') else str(exc),
            }
        }
        
        if hasattr(exc, 'error_dict'):
            error_data['error']['fields'] = exc.error_dict
        
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
    
    # For unhandled exceptions, return 500 error
    error_data = {
        'success': False,
        'error': {
            'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'message': 'An unexpected error occurred.'
        }
    }
    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)