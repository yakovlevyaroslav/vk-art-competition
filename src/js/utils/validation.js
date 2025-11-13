import {
  PHONE_MASK_PATTERN,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  MAX_DESCRIPTION_LENGTH,
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
 * Валидация ФИО
 * @param {string} name - ФИО пользователя
 * @returns {boolean} true, если имя состоит из 3 слов и содержит только буквы/дефис
 */
export function validateFullName(name) {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  const parts = trimmedName.split(/\s+/);
  if (parts.length !== 3) return false;

  return parts.every((part) => /^[а-яА-ЯёЁa-zA-Z-]+$/.test(part));
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
