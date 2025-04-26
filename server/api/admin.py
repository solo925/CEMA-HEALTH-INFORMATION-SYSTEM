from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, HealthProgram, Client, Enrollment

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

class EnrollmentInline(admin.TabularInline):
    model = Enrollment
    extra = 1
    autocomplete_fields = ('program',)

@admin.register(HealthProgram)
class HealthProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'start_date', 'end_date', 'enrolled_clients_count')
    list_filter = ('status', 'start_date', 'created_at')
    search_fields = ('name', 'description')
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')
    inlines = [EnrollmentInline]
    
    def enrolled_clients_count(self, obj):
        return obj.enrolled_clients_count
    enrolled_clients_count.short_description = 'Enrolled Clients'

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'gender', 'email', 'contact_number', 'registration_date')
    list_filter = ('gender', 'registration_date')
    search_fields = ('first_name', 'last_name', 'email', 'contact_number')
    date_hierarchy = 'registration_date'
    readonly_fields = ('registration_date', 'created_at', 'updated_at')
    inlines = [EnrollmentInline]
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'gender')
        }),
        ('Contact Information', {
            'fields': ('email', 'contact_number', 'address', 'emergency_contact')
        }),
        ('System Information', {
            'fields': ('registration_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('client', 'program', 'enrollment_date', 'status')
    list_filter = ('status', 'enrollment_date')
    search_fields = ('client__first_name', 'client__last_name', 'program__name')
    date_hierarchy = 'enrollment_date'
    autocomplete_fields = ('client', 'program')
    readonly_fields = ('created_at', 'updated_at')