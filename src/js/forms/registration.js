import {
  validateFullName,
  validatePhone,
  validateFile,
  validateDescription,
  validatePortfolioUrlOptional,
  validateEmail,
  validateSingleFile,
  validateImageDimensions,
} from '../utils/validation.js';
import { applyPhoneMask } from '../utils/phoneMask.js';
import {
  showError,
  hideError,
  showSuccess,
  showErrorNotification,
  hideNotification,
} from '../utils/notifications.js';
import { FORM_API_URL, MAX_DESCRIPTION_LENGTH } from '../constants.js';

const setFieldSuccess = (inputElement) => {
  if (!inputElement) return;
  inputElement.classList.remove('error');
  inputElement.classList.add('success');
};

const resetFieldState = (inputElement) => {
  if (!inputElement) return;
  inputElement.classList.remove('error');
  inputElement.classList.remove('success');
};

/**
 * Инициализация формы регистрации
 */
export function initRegistrationForm() {
  const registrationForm = document.getElementById('registration-form');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const fileInput = document.getElementById('work-file');
  const fileInfo = document.getElementById('file-info');
  const customFileUpload = document.getElementById('custom-file-upload');
  const customFilePreview = document.querySelector('.custom-file-upload__preview');
  const fileClearButton = document.getElementById('file-clear');
  const descriptionTextarea = document.getElementById('description');
  const descriptionCounter = document.getElementById('description-counter');
  const portfolioInput = document.getElementById('portfolio-url');
  const emailInput = document.getElementById('email');
  const notificationId = 'registration-notification';
  
  if (!registrationForm) return;
  
  let fileInputTouched = false; // Флаг, что пользователь пытался загрузить файл
  let previewObjectUrl = null;

  const resetPreview = () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }
    if (customFilePreview) {
      customFilePreview.innerHTML = '';
      customFilePreview.classList.remove('is-visible');
    }
    if (customFileUpload) {
      customFileUpload.classList.remove('has-file');
    }
    if (fileClearButton) {
      fileClearButton.classList.remove('is-visible');
    }
  };
  
  const updateDescriptionCounter = () => {
    if (descriptionCounter && descriptionTextarea) {
      const currentLength = descriptionTextarea.value.length;
      descriptionCounter.textContent = `${currentLength} / ${MAX_DESCRIPTION_LENGTH}`;
    }
  };
  
  // Инициализация маски телефона
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      applyPhoneMask(e.target);
      hideError('phone-error', phoneInput);
      hideNotification(notificationId);
      resetFieldState(phoneInput);
    });
    
    phoneInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value && !validatePhone(value)) {
        showError('phone-error', 'Неверный формат телефона. Используйте формат: +7 (999) 123-45-67', phoneInput);
      } else if (value && validatePhone(value)) {
        hideError('phone-error', phoneInput);
        setFieldSuccess(phoneInput);
      } else if (!value) {
        resetFieldState(phoneInput);
      }
    });
    
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 (';
      }
      resetFieldState(phoneInput);
    });
  }
  
  // Валидация поля имени
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      hideError('name-error', nameInput);
      hideNotification(notificationId);
      resetFieldState(nameInput);
    });
    
    nameInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value && !validateFullName(value)) {
        showError('name-error', 'Используйте буквы, цифры и символы @ . _ - (до 60 символов)', nameInput);
      } else if (value && validateFullName(value)) {
        hideError('name-error', nameInput);
        setFieldSuccess(nameInput);
      } else if (!value) {
        resetFieldState(nameInput);
      }
    });
  }
  
  // Валидация описания
  if (descriptionTextarea) {
    descriptionTextarea.addEventListener('input', () => {
      updateDescriptionCounter();
      hideError('description-error', descriptionTextarea);
      hideNotification(notificationId);
      resetFieldState(descriptionTextarea);
    });
    
    descriptionTextarea.addEventListener('blur', (e) => {
      const value = e.target.value;
      if (value && !validateDescription(value)) {
        showError('description-error', 'Описание обязательно и не должно превышать 400 символов', descriptionTextarea);
      } else if (value) {
        hideError('description-error', descriptionTextarea);
        setFieldSuccess(descriptionTextarea);
      } else {
        resetFieldState(descriptionTextarea);
      }
    });
    
    updateDescriptionCounter();
  }
  
  // Валидация портфолио (необязательное поле)
  if (portfolioInput) {
    portfolioInput.addEventListener('input', () => {
      hideError('portfolio-url-error', portfolioInput);
      hideNotification(notificationId);
      resetFieldState(portfolioInput);
    });
    
    portfolioInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      // Поле необязательное, но если заполнено - должно быть корректным
      if (value && !validatePortfolioUrlOptional(value, false)) {
        showError('portfolio-url-error', 'Введите корректный URL, начиная с http(s)://', portfolioInput);
      } else if (value) {
        hideError('portfolio-url-error', portfolioInput);
        setFieldSuccess(portfolioInput);
      } else {
        // Поле пустое - это нормально, сбрасываем состояние
        resetFieldState(portfolioInput);
      }
    });
  }
  
  // Валидация email
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      hideError('email-error', emailInput);
      hideNotification(notificationId);
      resetFieldState(emailInput);
    });
    
    emailInput.addEventListener('blur', (e) => {
      const value = e.target.value.trim();
      if (value && !validateEmail(value)) {
        showError('email-error', 'Введите корректный email-адрес', emailInput);
      } else if (value) {
        hideError('email-error', emailInput);
        setFieldSuccess(emailInput);
      } else {
        resetFieldState(emailInput);
      }
    });
  }
  
  // Валидация файла
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      fileInputTouched = true;
      const files = e.target.files;
      const file = files?.[0];
      hideError('file-error', fileInput);
      hideNotification(notificationId);
      resetFieldState(fileInput);
      
      resetPreview();
      
      if (!validateSingleFile(files)) {
        showError('file-error', 'Можно загрузить только одно изображение', fileInput);
        e.target.value = '';
        if (fileInfo) fileInfo.textContent = '';
        return;
      }
      
      if (file) {
        const validation = validateFile(file);
        if (!validation.valid) {
          showError('file-error', validation.message, fileInput);
          e.target.value = '';
          if (fileInfo) fileInfo.textContent = '';
          resetPreview();
          return;
        }
        
        // Проверяем размеры изображения
        const dimensionsValidation = await validateImageDimensions(file);
        if (!dimensionsValidation.valid) {
          showError('file-error', dimensionsValidation.message, fileInput);
          e.target.value = '';
          if (fileInfo) fileInfo.textContent = '';
          resetPreview();
          return;
        }
        
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (fileInfo) {
          fileInfo.textContent = `Выбран файл: ${file.name} (${sizeMB} МБ, ${dimensionsValidation.width}x${dimensionsValidation.height}px)`;
          fileInfo.style.color = '#27ae60';
        }
        
        previewObjectUrl = URL.createObjectURL(file);

        // Отображаем изображение в кастомном блоке загрузки
        if (customFilePreview) {
          customFilePreview.innerHTML = `
            <img src="${previewObjectUrl}" alt="Загруженное изображение">
          `;
          customFilePreview.classList.add('is-visible');
        }

        if (customFileUpload) {
          customFileUpload.classList.add('has-file');
        }

        if (fileClearButton) {
          fileClearButton.classList.add('is-visible');
        }

        setFieldSuccess(fileInput);
      } else if (fileInputTouched) {
        showError('file-error', 'Пожалуйста, выберите файл', fileInput);
        if (fileInfo) fileInfo.textContent = '';
        resetPreview();
      }
    });
    
    // При blur, если файл не выбран и пользователь уже пытался его загрузить
    fileInput.addEventListener('blur', () => {
      if (fileInputTouched && !fileInput.files[0]) {
        showError('file-error', 'Пожалуйста, выберите файл', fileInput);
      }
    });
  }

  // Обработка клика на кастомный блок загрузки
  if (customFileUpload) {
    customFileUpload.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Обработка клика на кнопку очистки
  if (fileClearButton) {
    fileClearButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Предотвращаем всплытие события
      fileInput.value = '';
      if (fileInfo) fileInfo.textContent = '';
      resetPreview();
      hideError('file-error', fileInput);
      hideNotification(notificationId);
      resetFieldState(fileInput);
      fileInputTouched = false;
    });
  }

  // Обработка формы регистрации
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Скрываем все ошибки и уведомления
    hideError('name-error', nameInput);
    hideError('phone-error', phoneInput);
    hideError('file-error', fileInput);
    hideError('description-error', descriptionTextarea);
    hideError('portfolio-url-error', portfolioInput);
    hideError('email-error', emailInput);
    hideNotification(notificationId);
    
    // Получаем значения
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const description = descriptionTextarea?.value || '';
    const portfolioUrl = portfolioInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const file = fileInput?.files[0];
    
    // Отмечаем, что пользователь пытался отправить форму
    if (fileInput) {
      fileInputTouched = true;
    }
    
    // Валидация полей
    const isValid = await validateRegistrationForm({
      name,
      nameInput,
      phone,
      phoneInput,
      file,
      fileInput,
      description,
      descriptionTextarea,
      portfolioUrl,
      portfolioInput,
      email,
      emailInput,
    });
    
    if (!isValid) {
      showErrorNotification(notificationId, 'Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    try {
      const workImage = await readFileAsDataUrl(file);
      const payload = {
        name,
        email,
        phone: formatPhoneForSubmission(phone),
        description: description.trim(),
        portfolio_url: portfolioUrl || null,
        work_image: workImage,
      };
      
      const response = await fetch(FORM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Парсим JSON ответ от сервера
      const responseData = await response.json();
      
      if (!response.ok) {
        // Показываем сообщение об ошибке от сервера
        const errorMessage = responseData.message || responseData.error || `Ошибка ${response.status}`;
        
        // Если есть детальные ошибки по полям - показываем их
        if (responseData.errors) {
          Object.keys(responseData.errors).forEach((fieldName) => {
            const errorMsg = responseData.errors[fieldName];
            
            // Маппинг полей формы
            const fieldMap = {
              'name': { errorId: 'name-error', input: nameInput },
              'email': { errorId: 'email-error', input: emailInput },
              'phone': { errorId: 'phone-error', input: phoneInput },
              'description': { errorId: 'description-error', input: descriptionTextarea },
              'portfolio_url': { errorId: 'portfolio-url-error', input: portfolioInput },
              'work_image': { errorId: 'file-error', input: fileInput },
            };
            
            const field = fieldMap[fieldName];
            if (field) {
              showError(field.errorId, Array.isArray(errorMsg) ? errorMsg[0] : errorMsg, field.input);
            }
          });
        }
        
        showErrorNotification(notificationId, errorMessage);
        return;
      }
      
      // Показываем сообщение об успехе от сервера
      const successMessage = responseData.message || 'Спасибо! Ваша заявка отправлена.';
      showSuccess(notificationId, successMessage);
      
      registrationForm.reset();
      updateDescriptionCounter();
      resetPreview();
      if (fileInfo) fileInfo.textContent = '';
      fileInputTouched = false;
      registrationForm
        .querySelectorAll('input, textarea')
        .forEach((field) => resetFieldState(field));
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      
      // Пытаемся получить сообщение об ошибке
      let errorMessage = 'Не удалось отправить заявку. Попробуйте ещё раз позднее.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      showErrorNotification(notificationId, errorMessage);
    }
    
    return;
  });
}

/**
 * Валидирует форму регистрации
 * @param {Object} params - параметры формы
 * @returns {Promise<boolean>}
 */
async function validateRegistrationForm({
  name,
  nameInput,
  phone,
  phoneInput,
  file,
  fileInput,
  description,
  descriptionTextarea,
  portfolioUrl,
  portfolioInput,
  email,
  emailInput,
}) {
  let isValid = true;
  
  // Валидация имени
  if (!name) {
    showError('name-error', 'Поле «ФИО» обязательно для заполнения', nameInput);
    isValid = false;
  } else if (!validateFullName(name)) {
    showError('name-error', 'Используйте буквы, цифры и символы @ . _ - (до 60 символов)', nameInput);
    isValid = false;
  } else {
    hideError('name-error', nameInput);
    setFieldSuccess(nameInput);
  }
  
  // Валидация телефона
  if (!phone) {
    showError('phone-error', 'Поле «Телефон» обязательно для заполнения', phoneInput);
    isValid = false;
  } else if (!validatePhone(phone)) {
    showError('phone-error', 'Неверный формат телефона. Используйте формат: +7 (999) 123-45-67', phoneInput);
    isValid = false;
  } else {
    hideError('phone-error', phoneInput);
    setFieldSuccess(phoneInput);
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
    } else if (!validateSingleFile({ length: 1 })) {
      showError('file-error', 'Можно загрузить только одно изображение', fileInput);
      isValid = false;
    } else {
      // Проверяем размеры изображения
      const dimensionsValidation = await validateImageDimensions(file);
      if (!dimensionsValidation.valid) {
        showError('file-error', dimensionsValidation.message, fileInput);
        isValid = false;
      } else {
        hideError('file-error', fileInput);
        setFieldSuccess(fileInput);
      }
    }
  }
  
  // Валидация описания
  if (!description || !validateDescription(description)) {
    showError('description-error', 'Описание обязательно и не должно превышать 400 символов', descriptionTextarea);
    isValid = false;
  } else {
    hideError('description-error', descriptionTextarea);
    setFieldSuccess(descriptionTextarea);
  }
  
  // Валидация портфолио (необязательное поле)
  if (portfolioUrl && !validatePortfolioUrlOptional(portfolioUrl, false)) {
    showError('portfolio-url-error', 'Введите корректный URL, начиная с http(s)://', portfolioInput);
    isValid = false;
  } else if (portfolioUrl) {
    // Поле заполнено и валидно
    hideError('portfolio-url-error', portfolioInput);
    setFieldSuccess(portfolioInput);
  } else {
    // Поле пустое - это нормально, сбрасываем состояние
    hideError('portfolio-url-error', portfolioInput);
    resetFieldState(portfolioInput);
  }
  
  // Валидация email
  if (!email || !validateEmail(email)) {
    showError('email-error', 'Введите корректный email-адрес', emailInput);
    isValid = false;
  } else {
    hideError('email-error', emailInput);
    setFieldSuccess(emailInput);
  }
  
  return isValid;
}

/**
 * Преобразует телефон к формату +7-XXX-XXX-XX-XX
 * @param {string} phone
 * @returns {string}
 */
function formatPhoneForSubmission(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) {
    return phone;
  }
  
  return [
    '+7',
    digits.slice(1, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ].join('-');
}

/**
 * Возвращает dataURL файла
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
