from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.core.files.base import ContentFile
from PIL import Image
import json
import base64
import uuid
from io import BytesIO
from .models import Application, Vote


@method_decorator(csrf_exempt, name='dispatch')
class ApplicationView(View):
    """API для подачи заявок"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            applicant_ip = self.get_client_ip(request)
            
            # Проверка, не подавал ли уже заявку этот IP
            if Application.objects.filter(applicant_ip=applicant_ip).exists():
                return JsonResponse({
                    'error': 'С этого IP уже была подана заявка. Один IP может подать только одну заявку.'
                }, status=400)
            
            # Валидация обязательных полей
            required_fields = ['name', 'email', 'phone', 'description', 'work_image']
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({
                        'error': f'Поле {field} обязательно для заполнения'
                    }, status=400)
            
            # Обработка изображения (base64)
            try:
                # Извлекаем данные изображения из base64
                image_data = data['work_image']
                if image_data.startswith('data:image'):
                    # Убираем префикс data:image/png;base64,
                    image_data = image_data.split(',')[1]
                
                # Декодируем base64
                image_bytes = base64.b64decode(image_data)
                
                # Проверка размера изображения
                try:
                    image = Image.open(BytesIO(image_bytes))
                    width, height = image.size
                    
                    # Минимальный размер: 1000x1000 пикселей
                    min_size = 1000
                    if width < min_size or height < min_size:
                        return JsonResponse({
                            'error': f'Размер изображения должен быть минимум {min_size}x{min_size} пикселей. Текущий размер: {width}x{height}'
                        }, status=400)
                    
                except Exception as e:
                    return JsonResponse({
                        'error': f'Ошибка при проверке изображения: {str(e)}'
                    }, status=400)
                
                # Создаем уникальное имя файла
                filename = f"work_{uuid.uuid4().hex}.png"
                
                # Сохраняем файл
                image_file = ContentFile(image_bytes, name=filename)
                
            except Exception as e:
                return JsonResponse({
                    'error': f'Ошибка обработки изображения: {str(e)}'
                }, status=400)
            
            # Создание заявки
            application = Application.objects.create(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                description=data['description'],
                portfolio_url=data.get('portfolio_url', ''),
                work_image=image_file,
                applicant_ip=applicant_ip
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Заявка успешно подана',
                'application_id': application.id
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Неверный формат JSON'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при создании заявки: {str(e)}'
            }, status=500)
    
    def get_client_ip(self, request):
        """Получение IP адреса клиента"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@method_decorator(csrf_exempt, name='dispatch')
class VoteView(View):
    """API для голосования"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Валидация обязательных полей
            if 'application_id' not in data:
                return JsonResponse({
                    'error': 'Поле application_id обязательно'
                }, status=400)
            
            application_id = data['application_id']
            voter_ip = self.get_client_ip(request)
            
            # Проверка существования заявки
            if not Application.objects.filter(id=application_id).exists():
                return JsonResponse({
                    'error': f'Заявка с ID {application_id} не найдена'
                }, status=404)
            
            # Проверка, не голосовал ли уже этот IP вообще
            if Vote.objects.filter(voter_ip=voter_ip).exists():
                return JsonResponse({
                    'error': 'Вы уже голосовали. Один IP может проголосовать только один раз.'
                }, status=400)
            
            # Создаем новый голос
            vote = Vote.objects.create(
                application_id=application_id,
                voter_ip=voter_ip
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Голос успешно засчитан',
                'vote_id': vote.id
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Неверный формат JSON'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при голосовании: {str(e)}'
            }, status=500)
    
    def get_client_ip(self, request):
        """Получение IP адреса клиента"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
