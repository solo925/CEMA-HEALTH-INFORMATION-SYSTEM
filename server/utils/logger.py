import logging
import json
import traceback
from datetime import datetime
from django.conf import settings

class CustomJsonFormatter(logging.Formatter):
    """
    Custom JSON formatter for structured logging.
    Makes logs easier to parse and search in log management systems.
    """
    def format(self, record):
        log_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'path': record.pathname,
            'line': record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_record['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'traceback': traceback.format_exception(*record.exc_info),
            }
        
        # Add extra info if present
        if hasattr(record, 'data') and record.data:
            log_record['data'] = record.data
        
        return json.dumps(log_record)

def configure_logging():
    """
    Configure structured JSON logging for the application.
    """
    # Root logger configuration
    root_logger = logging.getLogger()
    
    # Clear existing handlers
    if root_logger.handlers:
        for handler in root_logger.handlers:
            root_logger.removeHandler(handler)
    
    # Set log level based on settings
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(CustomJsonFormatter())
    root_logger.addHandler(console_handler)
    
    # Create file handler if log file is specified
    if hasattr(settings, 'LOG_FILE'):
        file_handler = logging.FileHandler(settings.LOG_FILE)
        file_handler.setFormatter(CustomJsonFormatter())
        root_logger.addHandler(file_handler)
    
    # Configure specific loggers
    django_logger = logging.getLogger('django')
    django_logger.setLevel(getattr(logging, settings.DJANGO_LOG_LEVEL))
    
    # Disable Django's request logging in favor of our middleware
    django_request_logger = logging.getLogger('django.request')
    django_request_logger.propagate = False
    
    # Configure API logger
    api_logger = logging.getLogger('api')
    api_logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    
    return root_logger

def log_api_request(request, response=None, execution_time=None):
    """
    Log API request and response details.
    Used for audit trail and performance monitoring.
    """
    logger = logging.getLogger('api.request')
    
    # Basic request info
    log_data = {
        'method': request.method,
        'path': request.path,
        'ip': request.META.get('REMOTE_ADDR'),
        'user_id': getattr(request.user, 'id', None),
        'user_email': getattr(request.user, 'email', None) if hasattr(request.user, 'email') else None,
    }
    
    # Include query parameters if present
    if request.GET:
        log_data['query_params'] = dict(request.GET)
    
    # Include request body for POST/PUT/PATCH if not multipart
    if request.method in ['POST', 'PUT', 'PATCH'] and not request.content_type.startswith('multipart/form-data'):
        try:
            log_data['request_body'] = json.loads(request.body.decode('utf-8'))
        except:
            log_data['request_body'] = '<unable to parse>'
    
    # Include response details if provided
    if response:
        log_data['status_code'] = response.status_code
        
        # Log response content for errors
        if response.status_code >= 400:
            try:
                log_data['response_body'] = json.loads(response.content.decode('utf-8'))
            except:
                log_data['response_body'] = '<unable to parse>'
    
    # Include execution time if provided
    if execution_time:
        log_data['execution_time_ms'] = execution_time
    
    # Log at appropriate level based on response status
    if response and response.status_code >= 500:
        logger.error('API request error', extra={'data': log_data})
    elif response and response.status_code >= 400:
        logger.warning('API request warning', extra={'data': log_data})
    else:
        logger.info('API request', extra={'data': log_data})
    
    return log_data