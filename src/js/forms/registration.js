import { validateName, validatePhone, validateFile } from '../utils/validation.js';
import { applyPhoneMask } from '../utils/phoneMask.js';
import { showError, hideError, showSuccess, showErrorNotification, hideNotification } from '../utils/notifications.js';

/**
 * Инициализация формы регистрации
 */
export function initRegistrationForm() {
  const registrationForm = document.getElementById('registration-form');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const fileInput = document.getElementById('work-file');
  const fileInfo = document.getElementById('file-info');
  
  if (!registrationForm) return;
  
  let fileInputTouched = false; // Флаг, что пользователь пытался загрузить файл
  
  // Инициализация маски телефона
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      applyPhoneMask(e.target);
      hideError('phone-error', phoneInput);
      hideNotification('registration-notification');
    });
    
    phoneInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value && !validatePhone(value)) {
        showError('phone-error', 'Неверный формат телефона. Используйте формат: +7 (987) 654-32-10', phoneInput);
      } else if (value && validatePhone(value)) {
        hideError('phone-error', phoneInput);
      }
    });
    
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 (';
      }
    });
  }
  
  // Валидация поля имени
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      hideError('name-error', nameInput);
      hideNotification('registration-notification');
    });
    
    nameInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value && !validateName(value)) {
        showError('name-error', 'Имя должно содержать от 2 до 50 символов и только буквы', nameInput);
      } else if (value && validateName(value)) {
        hideError('name-error', nameInput);
      }
    });
  }
  
  // Валидация файла
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      fileInputTouched = true;
      const file = e.target.files[0];
      hideError('file-error', fileInput);
      hideNotification('registration-notification');
      
      if (file) {
        const validation = validateFile(file);
        if (!validation.valid) {
          showError('file-error', validation.message, fileInput);
          e.target.value = '';
          if (fileInfo) fileInfo.textContent = '';
          return;
        }
        
        // Файл валиден - убираем класс ошибки
        fileInput.classList.remove('error');
        
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (fileInfo) {
          fileInfo.textContent = `Выбран файл: ${file.name} (${sizeMB} МБ)`;
          fileInfo.style.color = '#27ae60';
        }
      } else if (fileInputTouched) {
        showError('file-error', 'Пожалуйста, выберите файл', fileInput);
        if (fileInfo) fileInfo.textContent = '';
      }
    });
    
    // При blur, если файл не выбран и пользователь уже пытался его загрузить
    fileInput.addEventListener('blur', () => {
      if (fileInputTouched && !fileInput.files[0]) {
        showError('file-error', 'Пожалуйста, выберите файл', fileInput);
      }
    });
  }
  
  // Обработка формы регистрации
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Скрываем все ошибки и уведомления
    hideError('name-error', nameInput);
    hideError('phone-error', phoneInput);
    hideError('file-error', fileInput);
    hideNotification('registration-notification');
    
    // Получаем значения
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const file = fileInput?.files[0];
    
    // Отмечаем, что пользователь пытался отправить форму
    if (fileInput) {
      fileInputTouched = true;
    }
    
    // Валидация полей
    const validation = validateRegistrationForm(name, nameInput, phone, phoneInput, file, fileInput);
    
    if (!validation.isValid) {
      showErrorNotification('registration-notification', 'Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    // Если все валидно, отправляем форму
    console.log('Регистрация:', {
      name,
      phone,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });
    
    // Показываем успешное уведомление
    showSuccess('registration-notification', 'Спасибо за регистрацию! Ваши данные успешно отправлены.');
    registrationForm.reset();
    if (fileInfo) fileInfo.textContent = '';
    fileInputTouched = false;
  });
}

/**
 * Валидирует форму регистрации
 * @param {string} name - Имя пользователя
 * @param {HTMLElement} nameInput - Элемент input имени
 * @param {string} phone - Телефон пользователя
 * @param {HTMLElement} phoneInput - Элемент input телефона
 * @param {File|null} file - Файл
 * @param {HTMLElement} fileInput - Элемент input файла
 * @returns {Object} Результат валидации {isValid: boolean}
 */
function validateRegistrationForm(name, nameInput, phone, phoneInput, file, fileInput) {
  let isValid = true;
  
  // Валидация имени
  if (!name) {
    showError('name-error', 'Поле "Имя" обязательно для заполнения', nameInput);
    isValid = false;
  } else if (!validateName(name)) {
    showError('name-error', 'Имя должно содержать от 2 до 50 символов и только буквы', nameInput);
    isValid = false;
  } else {
    hideError('name-error', nameInput);
  }
  
  // Валидация телефона
  if (!phone) {
    showError('phone-error', 'Поле "Телефон" обязательно для заполнения', phoneInput);
    isValid = false;
  } else if (!validatePhone(phone)) {
    showError('phone-error', 'Неверный формат телефона. Используйте формат: +7 (987) 654-32-10', phoneInput);
    isValid = false;
  } else {
    hideError('phone-error', phoneInput);
  }
  
  // Валидация файла
  if (!file) {
    showError('file-error', 'Пожалуйста, выберите файл', fileInput);
    isValid = false;
  } else {
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      showError('file-error', fileValidation.message, fileInput);
      isValid = false;
    } else {
      hideError('file-error', fileInput);
    }
  }
  
  return { isValid };
}
