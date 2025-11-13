// Константы
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 МБ в байтах
export const PHONE_MASK_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
export const MAX_DESCRIPTION_LENGTH = 400;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const MIN_IMAGE_WIDTH = 1000; // Минимальная ширина изображения в пикселях
export const MIN_IMAGE_HEIGHT = 1000; // Минимальная высота изображения в пикселях

// Для разработки используем относительный путь (проксируется через webpack)
// Для продакшена можно будет изменить на полный URL
export const FORM_API_URL = '/api/application/';
