# Vote Apps - Backend API

Django REST API для конкурса с подачей заявок и голосованием.

## 🚀 Запуск проекта с нуля

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd vote_apps
```

### 2. Установка зависимостей

**Требования:** Python 3.8+ должен быть установлен

```bash
# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установка Python зависимостей
pip install -r requirements.txt
```

### 3. Настройка базы данных

```bash
# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Создание суперпользователя (для доступа к админке)
python manage.py createsuperuser
```

### 4. Запуск сервера

```bash
python manage.py runserver
```

API будет доступно на: `http://127.0.0.1:8000`

---

## 📁 Структура проекта

```
vote_apps/
├── vote_apps/              # Django проект
│   ├── contest/            # Django приложение
│   │   ├── models.py       # Модели данных
│   │   ├── views.py        # API views
│   │   ├── urls.py         # API роуты
│   │   └── admin.py        # Админка
│   ├── settings.py         # Настройки Django
│   └── urls.py             # Главные URL
├── media/                  # Загруженные файлы (изображения работ)
├── manage.py               # Django управляющий скрипт
└── requirements.txt        # Python зависимости
```

---

## 🔧 API эндпоинты

### Подача заявки
```bash
POST /api/application/
Content-Type: application/json

{
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7-999-123-45-67",
    "description": "Описание работы",
    "portfolio_url": "https://example.com/portfolio",  // необязательное
    "work_image": "data:image/png;base64,..."
}
```

**Ответ при успехе:**
```json
{
    "success": true,
    "message": "Заявка успешно подана",
    "application_id": 1
}
```

### Голосование
```bash
POST /api/vote/
Content-Type: application/json

{
    "application_id": 1
}
```

**Ответ при успехе:**
```json
{
    "success": true,
    "message": "Голос успешно засчитан",
    "vote_id": 1
}
```

---

## 🔐 Ограничения

- **Один IP = одна заявка** (нельзя подать заявку дважды с одного IP)
- **Один IP = один голос** (нельзя проголосовать дважды с одного IP)

---

## 📊 Админка

Доступ: `http://127.0.0.1:8000/admin/`

Логин/пароль: используйте данные суперпользователя, созданного через `createsuperuser`

В админке можно:
- Просматривать все заявки с превью изображений
- Просматривать все голоса
- Редактировать и удалять записи
- Управлять IP адресами

---

## 🛠️ Полезные команды

```bash
# Проверка проекта на ошибки
python manage.py check

# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```

---

## 📝 Примечания

- База данных SQLite создается автоматически при первом запуске
- Медиа файлы сохраняются в папку `media/contest_works/`
- Изображения доступны по URL: `http://127.0.0.1:8000/media/contest_works/filename.png`
- API работает с CORS (можно подключать любой фронтенд)

---

## 🌐 Настройка для работы с фронтендом

Для работы с отдельным фронтендом настройте CORS в `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',  # pip install django-cors-headers
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React
    "http://localhost:5173",  # Vite
    "http://localhost:8080",  # Vue
    # Добавьте URL вашего фронтенда
]
```

---

## 📦 Зависимости

- Django 5.2.7
- Pillow 12.0.0 (для работы с изображениями)
