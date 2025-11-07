import './styles/main.scss';
import { initRegistrationForm } from './js/forms/registration.js';

/**
 * Инициализирует плавную прокрутку для якорных ссылок
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Основная функция инициализации приложения
 */
function init() {
  // Инициализация форм
  initRegistrationForm();
  
  // Инициализация дополнительных функций
  initSmoothScroll();
  
  console.log('Приложение загружено!');
}

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
