# VK Art Competition - Landing Page

Одностраничный лендинг для конкурса VK Art с несколькими формами.

## Установка

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

Запустит dev server на http://localhost:9000 с hot reload и source maps.

## Сборка для production

```bash
npm run build
```

Создаст минифицированный код с автопрефиксерами в папке `dist/`.

## Сборка для development

```bash
npm run build:dev
```

Соберет код без минификации (но с source maps) в папку `dist/`.

## Особенности

- ✅ Webpack 5
- ✅ SCSS поддержка
- ✅ Автопрефиксер для CSS
- ✅ Минификация в production режиме
- ✅ Source maps в development режиме
- ✅ Hot Module Replacement (HMR)
- ✅ Обработка изображений и шрифтов
- ✅ Оптимизация через code splitting
- ✅ Babel для поддержки современного JavaScript

## Структура проекта

```
├── src/
│   ├── index.html      # Главная HTML страница
│   ├── index.js        # Точка входа JavaScript
│   └── styles/
│       └── main.scss   # Основные стили
├── dist/               # Собранный проект (создается автоматически)
├── webpack.config.js   # Конфигурация Webpack
├── package.json
└── README.md
```

