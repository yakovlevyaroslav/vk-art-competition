# Vote Apps - Конкурс заявок с голосованием

Django проект для конкурса с подачей заявок и голосованием.

## 🚀 Запуск проекта с нуля

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd vote_apps
```

### 2. Установка зависимостей для фронтенда

**Требования:** Node.js и npm должны быть установлены

```bash
# Установка всех npm пакетов
npm install
```

### 3. Установка зависимостей для бэкенда

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

### 4. Настройка базы данных

```bash
# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Создание суперпользователя (для доступа к админке)
python manage.py createsuperuser
```

### 5. Сборка фронтенда

```bash
# Production сборка (минифицированная)
npm run build

# Или Development сборка (с source maps)
npm run build:dev
```

### 6. Запуск проекта

#### Вариант 1: Production (рекомендуется)

```bash
# Собрать фронтенд
npm run build

# Запустить Django сервер
python manage.py runserver
```

Откройте в браузере: `http://127.0.0.1:8000`

#### Вариант 2: Development (с hot reload)

**Терминал 1 - Django сервер:**
```bash
python manage.py runserver
```

**Терминал 2 - Webpack Dev Server:**
```bash
npm run dev
```

Webpack Dev Server будет доступен на: `http://localhost:9000`

---

## 📁 Структура проекта

```
vote_apps/
├── src/                    # Исходники фронтенда
│   ├── js/                 # JavaScript файлы
│   ├── styles/             # SCSS стили
│   └── index.html          # HTML шаблон
├── vote_apps/              # Django проект
│   ├── contest/            # Django приложение
│   ├── static/             # Собранные статические файлы (webpack)
│   ├── templates/          # HTML шаблоны (webpack)
│   └── settings.py         # Настройки Django
├── media/                  # Загруженные файлы (изображения работ)
├── manage.py               # Django управляющий скрипт
├── package.json            # npm зависимости
├── webpack.config.js       # Конфигурация Webpack
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

### Голосование
```bash
POST /api/vote/
Content-Type: application/json

{
    "application_id": 1
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

---

## 🛠️ Полезные команды

```bash
# Проверка проекта на ошибки
python manage.py check

# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Сборка фронтенда
npm run build

# Development режим фронтенда
npm run dev
```

---

## 📝 Примечания

- База данных SQLite создается автоматически при первом запуске
- Медиа файлы сохраняются в папку `media/contest_works/`
- Статические файлы собираются в `vote_apps/static/`
- HTML шаблоны собираются в `vote_apps/templates/`
