import django_filters
from .models import Client, HealthProgram

class ClientFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(method='filter_by_name')
    min_age = django_filters.NumberFilter(method='filter_by_min_age')
    max_age = django_filters.NumberFilter(method='filter_by_max_age')
    program = django_filters.UUIDFilter(field_name='programs__id')
    
    def filter_by_name(self, queryset, name, value):
        return queryset.filter(
            django_filters.Q(first_name__icontains=value) | 
            django_filters.Q(last_name__icontains=value)
        )
    
    def filter_by_min_age(self, queryset, name, value):
        from datetime import date, timedelta
        cutoff_date = date.today() - timedelta(days=365 * value)
        return queryset.filter(date_of_birth__lte=cutoff_date)
    
    def filter_by_max_age(self, queryset, name, value):
        from datetime import date, timedelta
        cutoff_date = date.today() - timedelta(days=365 * value)
        return queryset.filter(date_of_birth__gte=cutoff_date)
    
    class Meta:
        model = Client
        fields = ['gender', 'program', 'registration_date']


class ProgramFilter(django_filters.FilterSet):
    start_date_after = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = django_filters.DateFilter(field_name='start_date', lookup_expr='lte')
    
    class Meta:
        model = HealthProgram
        fields = ['status', 'start_date_after', 'start_date_before']