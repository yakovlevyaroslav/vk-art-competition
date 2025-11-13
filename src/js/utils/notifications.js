// Показ ошибки
export function showError(elementId, message, inputElement = null) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Добавляем класс ошибки к полю ввода, если оно указано
  if (inputElement) {
    inputElement.classList.remove('success');
    inputElement.classList.add('error');
  }
}

// Скрытие ошибки
export function hideError(elementId, inputElement = null) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  
  // Убираем класс ошибки с поля ввода, если оно указано
  if (inputElement) {
    inputElement.classList.remove('error');
  }
}

// Показ уведомления об успехе
export function showSuccess(notificationId, message) {
  const notificationElement = document.getElementById(notificationId);
  if (notificationElement) {
    notificationElement.textContent = message;
    notificationElement.className = 'form-notification success';
    notificationElement.style.display = 'block';
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
      hideNotification(notificationId);
    }, 5000);
  }
}

// Показ уведомления об ошибке
export function showErrorNotification(notificationId, message) {
  const notificationElement = document.getElementById(notificationId);
  if (notificationElement) {
    notificationElement.textContent = message;
    notificationElement.className = 'form-notification error';
    notificationElement.style.display = 'block';
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
      hideNotification(notificationId);
    }, 5000);
  }
}

// Скрытие уведомления
export function hideNotification(notificationId) {
  const notificationElement = document.getElementById(notificationId);
  if (notificationElement) {
    notificationElement.textContent = '';
    notificationElement.style.display = 'none';
    notificationElement.className = 'form-notification';
  }
}

