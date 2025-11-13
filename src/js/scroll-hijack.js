/**
 * Модуль для управления перехватом скролла в секции #participation
 * Когда секция достигает верха экрана, скролл управляет слайдером
 */

class ScrollHijack {
  constructor(participationSlider) {
    this.participationSlider = participationSlider;
    this.participationSection = document.getElementById('participation');
    this.sliderNav = document.querySelector('.participation-slider__nav');
    this.isHijacked = false;
    this.lastScrollTime = 0;
    this.scrollDelay = 600; // Задержка между переключениями слайдов (мс)
    this.stickyOffset = 0; // Сохраняем позицию, где началось залипание
    this.hasBeenActivated = false; // Флаг: был ли перехват уже активирован
    this.lastScrollY = window.pageYOffset; // Последняя позиция скролла
    this.hasScrolledSlider = false; // Флаг: проскроллил ли пользователь слайдер
    
    if (!this.participationSection || !this.participationSlider) {
      console.warn('ScrollHijack: секция #participation или слайдер не найдены');
      return;
    }

    this.init();
  }

  /**
   * Инициализация перехвата скролла
   */
  init() {
    // Скрываем навигацию слайдера изначально
    if (this.sliderNav) {
      this.sliderNav.style.opacity = '0';
      this.sliderNav.style.pointerEvents = 'none';
      this.sliderNav.style.transition = 'opacity 0.3s ease';
    }
    
    // Привязываем обработчики к this и сохраняем ссылки для удаления позже
    this.boundHandleScroll = this.handleScroll.bind(this);
    this.boundHandleWheel = this.handleWheel.bind(this);
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    
    // Отслеживаем положение секции при скролле
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
    
    // Перехватываем события колесика мыши
    window.addEventListener('wheel', this.boundHandleWheel, { passive: false });
    
    // Перехватываем события тачпада и touch-событий
    window.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
    
    // Обрабатываем изменение размера окна
    window.addEventListener('resize', this.boundHandleScroll, { passive: true });
  }

  /**
   * Проверяет, находится ли секция participation в центре экрана
   */
  checkSectionPosition() {
    const rect = this.participationSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const threshold = 100; // Порог в пикселях от центра экрана
    
    // Находим центр секции
    const sectionCenter = rect.top + (rect.height / 2);
    
    // Секция считается в центре, если её центр близок к центру viewport
    const isAtCenter = Math.abs(sectionCenter - viewportCenter) <= threshold;
    
    // Также проверяем, что секция достаточно видна
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    return isAtCenter && isVisible;
  }

  /**
   * Обработчик скролла страницы
   */
  handleScroll() {
    const currentScrollY = window.pageYOffset;
    const isScrollingDown = currentScrollY > this.lastScrollY;
    
    // Обновляем последнюю позицию скролла
    this.lastScrollY = currentScrollY;
    
    const shouldHijack = this.checkSectionPosition();
    
    // Активируем перехват только если:
    // 1. Секция в центре
    // 2. Скроллим вниз
    // 3. Перехват еще не был активирован в этой сессии
    if (shouldHijack && !this.isHijacked && !this.hasBeenActivated && isScrollingDown) {
      // Начинаем перехват скролла
      this.enableHijack();
      this.hasBeenActivated = true; // Помечаем, что перехват был активирован
    } else if (!shouldHijack && this.isHijacked) {
      // Прекращаем перехват скролла
      this.disableHijack();
    }
  }

  /**
   * Включает режим перехвата скролла
   */
  enableHijack() {
    this.isHijacked = true;
    this.participationSection.classList.add('scroll-hijacked');
    
    // Запоминаем текущую позицию скролла
    this.stickyOffset = window.pageYOffset;
  }

  /**
   * Отключает режим перехвата скролла
   */
  disableHijack() {
    this.isHijacked = false;
    this.participationSection.classList.remove('scroll-hijacked');
  }

  /**
   * Проверяет, дошел ли пользователь до последнего слайда
   * и показывает навигацию если да
   */
  checkAndShowSliderNav() {
    // Проверяем после небольшой задержки, чтобы слайдер успел переключиться
    setTimeout(() => {
      const currentIndex = this.participationSlider.currentIndex;
      const totalSlides = this.participationSlider.totalCards;
      
      // Показываем навигацию только когда достигнут последний слайд
      if (currentIndex === totalSlides - 1 && !this.hasScrolledSlider) {
        this.hasScrolledSlider = true;
        if (this.sliderNav) {
          this.sliderNav.style.opacity = '1';
          this.sliderNav.style.pointerEvents = 'auto';
        }
      }
    }, 100);
  }

  /**
   * Обработчик события колесика мыши
   */
  handleWheel(e) {
    if (!this.isHijacked) {
      return;
    }

    const currentTime = Date.now();
    
    // Проверяем, прошло ли достаточно времени с последнего скролла
    if (currentTime - this.lastScrollTime < this.scrollDelay) {
      e.preventDefault();
      return;
    }

    // Определяем направление скролла
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Обрабатываем скролл и проверяем, можем ли переключить слайд
    const canSwitch = this.canSwitchSlide(direction);
    
    if (canSwitch) {
      // Предотвращаем стандартное поведение скролла
      e.preventDefault();
      
      // Переключаем слайд
      if (direction === 'down') {
        this.participationSlider.next();
      } else {
        this.participationSlider.prev();
      }
      
      // Проверяем, нужно ли показать навигацию
      this.checkAndShowSliderNav();
      
      this.lastScrollTime = currentTime;
    }
    // Если не можем переключить слайд, позволяем браузеру скроллить страницу дальше
    // (не вызываем preventDefault)
  }

  /**
   * Проверяет, можем ли мы переключить слайд в заданном направлении
   * @param {string} direction - 'down' или 'up'
   * @returns {boolean}
   */
  canSwitchSlide(direction) {
    const slider = this.participationSlider;
    const currentIndex = slider.currentIndex;
    const totalSlides = slider.totalCards;

    if (direction === 'down') {
      // Скролл вниз - можем переключить, если не на последнем слайде
      return currentIndex < totalSlides - 1;
    } else {
      // Скролл вверх - можем переключить, если не на первом слайде
      return currentIndex > 0;
    }
  }

  // Touch события для мобильных устройств
  touchStartY = 0;
  touchEndY = 0;

  handleTouchStart(e) {
    if (!this.isHijacked) {
      return;
    }
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this.isHijacked) {
      return;
    }

    this.touchEndY = e.touches[0].clientY;

    const diff = this.touchStartY - this.touchEndY;
    const threshold = 50; // Минимальное расстояние свайпа

    if (Math.abs(diff) > threshold) {
      const currentTime = Date.now();
      
      if (currentTime - this.lastScrollTime < this.scrollDelay) {
        e.preventDefault();
        return;
      }

      const direction = diff > 0 ? 'down' : 'up';
      const canSwitch = this.canSwitchSlide(direction);

      if (canSwitch) {
        e.preventDefault();
        
        // Переключаем слайд
        if (direction === 'down') {
          this.participationSlider.next();
        } else {
          this.participationSlider.prev();
        }
        
        // Проверяем, нужно ли показать навигацию
        this.checkAndShowSliderNav();
        
        this.lastScrollTime = currentTime;
      }

      // Сбрасываем для следующего свайпа
      this.touchStartY = this.touchEndY;
    }
  }

  /**
   * Уничтожение обработчиков
   */
  destroy() {
    window.removeEventListener('scroll', this.boundHandleScroll);
    window.removeEventListener('wheel', this.boundHandleWheel);
    window.removeEventListener('touchstart', this.boundHandleTouchStart);
    window.removeEventListener('touchmove', this.boundHandleTouchMove);
    window.removeEventListener('resize', this.boundHandleScroll);
    
    this.disableHijack();
  }
}

export { ScrollHijack };

