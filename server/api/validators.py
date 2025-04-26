import re
from datetime import date
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_future_date(value):
    """
    Validate that a date is in the future.
    Used for validating program start dates.
    """
    if value < date.today():
        raise ValidationError(
            _('Date must be in the future.'),
            code='date_in_past',
        )

def validate_date_range(start_date, end_date):
    """
    Validate that end_date is after start_date.
    Used for validating program date ranges.
    """
    if end_date and start_date and end_date < start_date:
        raise ValidationError(
            _('End date must be after start date.'),
            code='invalid_date_range',
        )

def validate_phone_number(value):
    """
    Validate phone number format.
    Allows for various formats including international numbers.
    """
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)\.]', '', value)
    
    # Check if it's a valid phone number
    if not cleaned.isdigit():
        raise ValidationError(
            _('Phone number can only contain digits and separators.'),
            code='invalid_phone',
        )
    
    # Check length
    if len(cleaned) < 10 or len(cleaned) > 15:
        raise ValidationError(
            _('Phone number must be between 10 and 15 digits.'),
            code='invalid_phone_length',
        )
    
    return value

def validate_program_capacity(value):
    """
    Validate that program capacity is positive.
    """
    if value is not None and value <= 0:
        raise ValidationError(
            _('Capacity must be a positive number.'),
            code='invalid_capacity',
        )

def validate_enrollment_status(value, program_status):
    """
    Validate enrollment status based on program status.
    """
    if program_status == 'completed' and value == 'active':
        raise ValidationError(
            _('Cannot have active enrollment in a completed program.'),
            code='invalid_enrollment_status',
        )


