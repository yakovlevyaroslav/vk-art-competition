import { gsap } from 'gsap';

/**
 * Класс для управления слайдером participation-slider с эффектом перелистывания карт
 */
class ParticipationSlider {
  constructor() {
    this.slider = document.querySelector('.participation-slider');
    this.cards = document.querySelectorAll('.participation-card');
    this.prevButton = document.querySelector('.participation-slider__button_prev');
    this.nextButton = document.querySelector('.participation-slider__button_next');

    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.isAnimating = false;

    this.init();
  }

  /**
   * Инициализация слайдера
   */
  init() {
    if (!this.slider || !this.cards.length) return;

    this.setupInitialState();
    this.bindEvents();
  }

  /**
   * Установка начального состояния карт
   */
  setupInitialState() {
    // Устанавливаем начальные позиции карт без анимации
    this.cards.forEach((card, index) => {
      const offset = index - this.currentIndex;
      this.setCardPosition(card, offset);
    });
  }

  /**
   * Установка позиции карты в стеке
   * @param {HTMLElement} card - Карточка
   * @param {number} offset - Смещение от текущей позиции
   */
  setCardPosition(card, offset) {
    const baseZ = 0;
    const baseRotation = 0;
    const baseX = 0;
    const baseY = 0;
    const baseOpacity = 1;

    let zIndex, zTranslate, rotation, xTranslate, yTranslate, opacity, scale;

    if (offset === 0) {
      // Текущая активная карта (сверху)
      zIndex = 10;
      zTranslate = baseZ;
      rotation = baseRotation;
      xTranslate = baseX;
      yTranslate = baseY;
      opacity = baseOpacity;
      scale = 1;
    } else {
      // Карты под колодой (предыдущие)
      zIndex = Math.max(1, 10 - Math.abs(offset));
      zTranslate = baseZ - (Math.abs(offset) * 10);

      // Установка конкретных углов поворота для каждой позиции
      if (Math.abs(offset) === 1) {
        rotation = -5; // 2-й слайд
      } else if (Math.abs(offset) === 2) {
        rotation = 4;  // 3-й слайд
      } else if (Math.abs(offset) === 3) {
        rotation = -8; // 4-й слайд
      } else {
        rotation = baseRotation - (Math.abs(offset) * 1); // Для остальных
      }

      xTranslate = baseX;
      yTranslate = baseY + (Math.abs(offset) * 8); // Небольшое смещение вниз
      // Все карточки непрозрачные: 1-й: 1, 2-й: 1, 3-й: 1, 4-й: 1, 5-й: 1
      const opacityValues = [1, 1, 1, 1, 1];
      opacity = opacityValues[Math.abs(offset)] || 0.2;
      scale = Math.max(0.9, 1 - (Math.abs(offset) * 0.02));
    }

    gsap.set(card, {
      zIndex: zIndex,
      x: xTranslate,
      y: yTranslate,
      rotation: rotation,
      z: zTranslate,
      opacity: opacity,
      scale: scale
    });
  }

  /**
   * Перелистывание к следующей карте
   */
  next() {
    if (this.isAnimating) return;

    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
    this.animateTransition('forward');
  }

  /**
   * Перелистывание к предыдущей карте
   */
  prev() {
    if (this.isAnimating) return;

    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.animateTransition('backward');
  }

  /**
   * Анимация перехода между картами
   * @param {string} direction - направление анимации ('forward' или 'backward')
   */
  animateTransition(direction) {
    this.isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });

    // Получаем предыдущую активную карту (та, которая была активной до перелистывания)
    let previousCardIndex;
    if (direction === 'forward') {
      // При движении вперед: предыдущая карта - это (currentIndex - 1)
      previousCardIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    } else {
      // При движении назад: берем текущую карточку - 1
      previousCardIndex = (this.currentIndex - 0 + this.totalCards) % this.totalCards;
    }
    const previousCard = this.cards[previousCardIndex];

    // 1. Активная карточка улетает вниз и становится прозрачной
    tl.to(previousCard, {
      y: window.innerWidth < 768 ? 300 : 700,
      opacity: 0.6,
      duration: 1,
      ease: "power1.inOut"
    }, 0);

    // 2. Переустанавливаем позиции всех карт
    tl.call(() => {
      this.cards.forEach((card, index) => {
        const offset = index - this.currentIndex;
        this.setCardPosition(card, offset);
      });
    }, [], 1);
  }

  /**
   * Анимированная установка позиции карты
   * @param {HTMLElement} card - Карточка
   * @param {number} offset - Смещение от текущей позиции
   */
  animateCardToPosition(card, offset) {
    const baseZ = 0;
    const baseRotation = 0;
    const baseX = 0;
    const baseY = 0;
    const baseOpacity = 1;

    let zIndex, zTranslate, rotation, xTranslate, yTranslate, opacity, scale;

    if (offset === 0) {
      // Текущая активная карта (сверху)
      zIndex = 10;
      zTranslate = baseZ;
      rotation = baseRotation;
      xTranslate = baseX;
      yTranslate = baseY;
      opacity = baseOpacity;
      scale = 1;
    } else {
      // Карты под колодой (предыдущие)
      zIndex = Math.max(1, 10 - Math.abs(offset));
      zTranslate = baseZ - (Math.abs(offset) * 10);

      // Установка конкретных углов поворота для каждой позиции
      if (Math.abs(offset) === 1) {
        rotation = -5; // 2-й слайд
      } else if (Math.abs(offset) === 2) {
        rotation = 4;  // 3-й слайд
      } else if (Math.abs(offset) === 3) {
        rotation = -8; // 4-й слайд
      } else {
        rotation = baseRotation - (Math.abs(offset) * 1); // Для остальных
      }

      xTranslate = baseX;
      yTranslate = baseY + (Math.abs(offset) * 8); // Небольшое смещение вниз
      // Все карточки непрозрачные: 1-й: 1, 2-й: 1, 3-й: 1, 4-й: 1, 5-й: 1
      const opacityValues = [1, 1, 1, 1, 1];
      // opacity = opacityValues[Math.abs(offset)] || 0.2;
      scale = Math.max(0.9, 1 - (Math.abs(offset) * 0.02));
    }

    // Анимируем переход к новой позиции (без анимации прозрачности)
    gsap.to(card, {
      zIndex: zIndex,
      x: xTranslate,
      y: yTranslate,
      rotation: rotation,
      z: zTranslate,
      scale: scale,
      duration: 0.7,
      ease: "power1.inOut"
    });
  }

  /**
   * Получение индекса предыдущей карты
   */
  getPreviousIndex() {
    return (this.currentIndex - 1 + this.totalCards) % this.totalCards;
  }

  /**
   * Привязка обработчиков событий
   */
  bindEvents() {
    // Кнопки навигации
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.next();
      });
    }

    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.prev();
      });
    }

    // Клик по картам
    this.cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (index !== this.currentIndex) {
          // Если кликнули не на активную карту, переключаемся на неё
          const diff = index - this.currentIndex;
          if (diff > 0) {
            for (let i = 0; i < diff; i++) {
              this.next();
            }
          } else {
            for (let i = 0; i < Math.abs(diff); i++) {
              this.prev();
            }
          }
        }
      });
    });

    // Поддержка клавиатуры
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
  }


  /**
   * Уничтожение слайдера
   */
  destroy() {
    // Удаление обработчиков событий можно добавить при необходимости
  }
}

// Экспорт для использования
export { ParticipationSlider };
