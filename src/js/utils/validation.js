import {
  PHONE_MASK_PATTERN,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  MAX_DESCRIPTION_LENGTH,
  MIN_IMAGE_WIDTH,
  MIN_IMAGE_HEIGHT,
} from '../constants.js';

/**
 * Валидация телефона
 * @param {string} phone - Номер телефона
 * @returns {boolean} true, если телефон валиден
 */
export function validatePhone(phone) {
  return PHONE_MASK_PATTERN.test(phone);
}

/**
 * Валидация имени/псевдонима
 * @param {string} name - Имя или псевдоним пользователя
 * @returns {boolean} true, если имя содержит разрешенные символы
 */
export function validateFullName(name) {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  // Проверяем длину: минимум 2 символа, максимум 60
  if (trimmedName.length < 2 || trimmedName.length > 60) return false;

  // Разрешаем:
  // - русские и английские буквы (любой регистр)
  // - цифры
  // - дефисы, нижнее подчеркивание, пробелы
  // - символы: @ . _ -
  return /^[а-яА-ЯёЁa-zA-Z0-9\s@._-]+$/.test(trimmedName);
}

/**
 * Валидация описания идеи
 * @param {string} description - Описание
 * @returns {boolean}
 */
export function validateDescription(description) {
  const text = description.trim();
  return text.length > 0 && text.length <= MAX_DESCRIPTION_LENGTH;
}

/**
 * Валидация URL портфолио (необязательное поле)
 * @param {string} url - URL адрес
 * @param {boolean} required - Является ли поле обязательным
 * @returns {boolean}
 */
export function validatePortfolioUrlOptional(url, required = false) {
  const trimmedUrl = url.trim();
  
  // Если поле пустое и необязательное - валидно
  if (!trimmedUrl && !required) {
    return true;
  }
  
  // Если поле пустое и обязательное - невалидно
  if (!trimmedUrl && required) {
    return false;
  }
  
  // Если заполнено - проверяем формат
  return validatePortfolioUrl(trimmedUrl);
}

/**
 * Валидация URL портфолио
 * @param {string} url - URL адрес
 * @returns {boolean}
 */
export function validatePortfolioUrl(url) {
  try {
    const parsed = new URL(url.trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
}

/**
 * Валидация email
 * @param {string} email - Email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const trimmedEmail = email.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(trimmedEmail);
}

/**
 * Валидация файла
 * @param {File|null} file - Файл для проверки
 * @returns {Object} Результат валидации {valid: boolean, message?: string}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, message: 'Пожалуйста, выберите файл' };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'Файл должен быть в формате JPEG или PNG' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { 
      valid: false, 
      message: `Размер файла ${sizeMB} МБ превышает максимальный размер 20 МБ` 
    };
  }
  
  return { valid: true };
}

/**
 * Проверяет, что автор загрузил только один файл
 * @param {FileList} files
 * @returns {boolean}
 */
export function validateSingleFile(files) {
  return files && files.length === 1;
}

/**
 * Проверяет размеры изображения (минимум 1000x1000px)
 * @param {File} file - Файл изображения
 * @returns {Promise<Object>} Результат валидации {valid: boolean, message?: string, width?: number, height?: number}
 */
export function validateImageDimensions(file) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve({ valid: false, message: 'Файл должен быть изображением' });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const width = img.width;
      const height = img.height;

      if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) {
        resolve({
          valid: false,
          message: `Размер изображения ${width}x${height}px. Минимальный размер: ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px`,
          width,
          height,
        });
      } else {
        resolve({
          valid: true,
          width,
          height,
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, message: 'Не удалось загрузить изображение' });
    };

    img.src = objectUrl;
  });
}
