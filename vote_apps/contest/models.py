from django.db import models


class Application(models.Model):
    """Модель для заявок на конкурс"""
    name = models.CharField(max_length=100, verbose_name="Имя участника")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    description = models.TextField(verbose_name="Описание работы")
    portfolio_url = models.URLField(verbose_name="Ссылка на портфолио", blank=True, null=True)
    work_image = models.ImageField(upload_to='contest_works/', verbose_name="Работа (PNG)", null=True, blank=True)
    applicant_ip = models.GenericIPAddressField(unique=True, verbose_name="IP заявителя", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата подачи заявки")

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email}"


class Vote(models.Model):
    """Модель для голосования"""
    application_id = models.IntegerField(verbose_name="ID заявки")
    voter_ip = models.GenericIPAddressField(unique=True, verbose_name="IP голосующего")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата голосования")

    class Meta:
        verbose_name = "Голос"
        verbose_name_plural = "Голоса"
        ordering = ['-created_at']

    def __str__(self):
        return f"Голос за заявку {self.application_id} с IP {self.voter_ip}"
