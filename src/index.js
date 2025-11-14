import './styles/main.scss';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { initRegistrationForm } from './js/forms/registration.js';
import { initFliesAnimation } from './js/animation-gsap.js';
import { ParticipationSlider } from './js/participation-slider.js';

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
 * Инициализирует плавную прокрутку к форме регистрации при клике на .btn-to-form
 */
function initScrollToForm() {
  const btnToForm = document.querySelector('.btn-to-form');

  if (!btnToForm) return;

  btnToForm.addEventListener('click', (e) => {
    e.preventDefault();
    const registrationBlock = document.querySelector('#registration .title-main');

    if (registrationBlock) {
      registrationBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
}


/**
 * Инициализирует слайдер participation-slider с эффектом перелистывания карт
 */
function initParticipationSlider() {
  const participationSlider = new ParticipationSlider();
  
  return participationSlider;
}


/**
 * Основная функция инициализации приложения
 */
function init() {
  // Инициализация форм
  initRegistrationForm();

  // Инициализация дополнительных функций
  initSmoothScroll();
  initScrollToForm();
  initTimelineHighlight();
  initVotingSlider();
  initParticipationSlider();
  initFliesAnimation();

  console.log('Приложение загружено!');
}

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Подсвечивает элементы таймлайна, когда они находятся в центральной зоне экрана
 */
function initTimelineHighlight() {
  const timelineItems = Array.from(document.querySelectorAll('.timeline-list-item'));

  if (!timelineItems.length) {
    return;
  }

  timelineItems.forEach((item) => {
    if (!item.style.transition) {
      item.style.transition = 'opacity 0.3s ease';
    }

    if (!item.style.opacity) {
      item.style.opacity = '0.3';
    }
  });

  const highlightClosestItem = () => {
    const viewportCenter = window.innerHeight / 2;
    let closestItem = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    timelineItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    timelineItems.forEach((item) => {
      item.style.opacity = item === closestItem ? '1' : '0.3';
    });
  };

  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        highlightClosestItem();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', highlightClosestItem);

  highlightClosestItem();
}

/**
 * Инициализирует слайдер раздела голосования
 */
function initVotingSlider() {
  const sliderEl = document.querySelector('.voting-slider.swiper');

  if (!sliderEl) {
    return;
  }

  // eslint-disable-next-line no-new
  new Swiper(sliderEl, {
    modules: [Navigation],
    speed: 600,
    // centeredSlides: true,
    centeredSlidesBounds: true,
    loop: false,
    slidesPerView: 1,
    spaceBetween: 10,
    grabCursor: true,
    navigation: {
      nextEl: '.voting-slider__button_next',
      prevEl: '.voting-slider__button_prev',
    },
    // watchSlidesProgress: true,
    breakpoints: {
      480: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
    },
  });
}
