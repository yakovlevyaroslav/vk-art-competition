import { PHONE_MASK_PATTERN, MAX_FILE_SIZE } from '../constants.js';

/**
 * Валидация телефона
 * @param {string} phone - Номер телефона
 * @returns {boolean} true, если телефон валиден
 */
export function validatePhone(phone) {
  return PHONE_MASK_PATTERN.test(phone);
}

/**
 * Валидация имени
 * @param {string} name - Имя пользователя
 * @returns {boolean} true, если имя валидно (2-50 символов, только буквы)
 */
export function validateName(name) {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && 
         trimmedName.length <= 50 && 
         /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(trimmedName);
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
  
  if (file.type !== 'image/png') {
    return { valid: false, message: 'Файл должен быть в формате PNG' };
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
