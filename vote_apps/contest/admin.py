from django.contrib import admin
from .models import Application, Vote


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'portfolio_url', 'applicant_ip', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'portfolio_url']
    readonly_fields = ['created_at', 'applicant_ip']
    ordering = ['-created_at']


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['application_id', 'voter_ip', 'created_at']
    list_filter = ['created_at', 'application_id']
    search_fields = ['application_id', 'voter_ip']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
