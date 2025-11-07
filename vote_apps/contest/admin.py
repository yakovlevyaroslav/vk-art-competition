from django.contrib import admin
from django.utils.html import format_html
from .models import Application, Vote


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'portfolio_url', 'applicant_ip', 'work_image_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'portfolio_url']
    readonly_fields = ['created_at', 'applicant_ip', 'work_image_preview', 'work_image_detail']
    fields = ['name', 'email', 'phone', 'description', 'portfolio_url', 'work_image', 'work_image_detail', 'applicant_ip', 'created_at']
    ordering = ['-created_at']
    
    def work_image_preview(self, obj):
        """Отображение превью изображения в списке"""
        if obj.work_image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 4px;" />',
                obj.work_image.url
            )
        return "Нет изображения"
    work_image_preview.short_description = "Работа"
    
    def work_image_detail(self, obj):
        """Отображение большого изображения в детальном виде"""
        if obj.work_image:
            return format_html(
                '<img src="{}" style="max-width: 500px; max-height: 500px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px; padding: 10px;" />',
                obj.work_image.url
            )
        return "Изображение не загружено"
    work_image_detail.short_description = "Превью работы"


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['application_id', 'voter_ip', 'created_at']
    list_filter = ['created_at', 'application_id']
    search_fields = ['application_id', 'voter_ip']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
