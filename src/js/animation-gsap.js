import { gsap } from 'gsap';

/**
 * Создает бесконечную анимацию парения для отдельного элемента.
 * @param {HTMLElement} element
 * @param {number} index
 */
function createFloatingAnimation(element, index) {
  // Случайные параметры для каждого элемента
  const duration = 3 + Math.random() * 2; // 3-5 секунд
  const yOffset = 5 + Math.random() * 10; // 5-15px вертикальное смещение (уменьшил)
  const xOffset = 3 + Math.random() * 6; // 3-9px горизонтальное смещение (уменьшил)
  const rotation = -2 + Math.random() * 4; // -2 до 2 градусов поворота (уменьшил)
  const delay = index * 0.1; // Задержка между элементами

  // Анимация парения - используем transform отдельно от CSS позиционирования
  // Возвращаем объект анимации для возможности управления
  return gsap.to(element, {
    y: `+=${yOffset}`, // += для добавления к текущему положению
    x: `+=${xOffset}`,
    rotation: `+=${rotation}`,
    duration: duration,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
    delay: delay,
  });
}

/**
 * Запускает анимацию появления для элемента
 * @param {HTMLElement} element
 * @param {number} index
 */
function animateElementAppearance(element, index) {
  const delay = index * 0.1;

  gsap.fromTo(element,
    {
      opacity: 0,
      scale: 0.9
    },
    {
      opacity: 1,
      scale: 1.1,
      duration: 1.5,
      ease: "back.out(1.5)",
      delay: delay,
      onComplete: () => {
        // Возвращаем scale к нормальному размеру
        gsap.to(element, {
          scale: 1,
          duration: 2,
          ease: "power2.out",
          onComplete: () => {
            // После появления запускаем анимацию парения
            createFloatingAnimation(element, index);
          }
        });
      }
    }
  );
}

/**
 * Запускает анимацию парения для элемента (без появления)
 * @param {HTMLElement} element
 * @param {number} index
 */
function animateElementFloating(element, index) {
  // Сохраняем ссылку на анимацию для возможности управления
  element.floatingAnimation = createFloatingAnimation(element, index);
}

/**
 * Останавливает анимацию парения для элемента
 * @param {HTMLElement} element
 */
function stopElementFloating(element) {
  if (element.floatingAnimation) {
    element.floatingAnimation.pause();
  }
}

/**
 * Возобновляет анимацию парения для элемента
 * @param {HTMLElement} element
 */
function resumeElementFloating(element) {
  if (element.floatingAnimation) {
    element.floatingAnimation.resume();
  }
}

/**
 * Инициализирует анимацию появления и парения для элементов блока #flies.
 * Анимация появления запускается только когда flies-image становятся видимыми на экране.
 * Анимация парения запускается/останавливается в зависимости от видимости элементов.
 */
export function initFliesAnimation() {
  const fliesImages = document.querySelectorAll('.flies-image');
  const animatedImages = document.querySelectorAll('.animated-image');
  const allImages = [...fliesImages, ...animatedImages];

  if (!allImages.length) {
    return;
  }

  // Устанавливаем начальное состояние - скрытые элементы только для flies-image
  if (fliesImages.length) {
    gsap.set(fliesImages, {
      opacity: 0,
    });
  }

  // Создаем Intersection Observer для отслеживания видимости всех элементов
  const observerOptions = {
    root: null, // viewport
    rootMargin: '50px', // добавляем небольшую границу для плавности
    threshold: 0.1 // элемент считается видимым, если 10% его площади видно
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const isFliesImage = entry.target.classList.contains('flies-image');

      if (entry.isIntersecting) {
        // Элемент стал видимым
        if (isFliesImage) {
          // Элемент flies-image стал видимым - запускаем анимацию появления (если еще не запущена)
          if (!entry.target.hasAppeared) {
            const elementIndex = Array.from(fliesImages).indexOf(entry.target);
            animateElementAppearance(entry.target, elementIndex);
            entry.target.hasAppeared = true; // помечаем, что анимация появления уже была
          } else {
            // Если анимация появления уже была, просто возобновляем парение
            resumeElementFloating(entry.target);
          }
        } else {
          // Элемент animated-image стал видимым - запускаем анимацию парения
          if (!entry.target.floatingAnimation) {
            const elementIndex = Array.from(animatedImages).indexOf(entry.target);
            animateElementFloating(entry.target, elementIndex);
          } else {
            resumeElementFloating(entry.target);
          }
        }
      } else {
        // Элемент перестал быть видимым - останавливаем анимацию парения
        stopElementFloating(entry.target);
      }
    });
  }, observerOptions);

  // Начинаем наблюдение за всеми элементами
  allImages.forEach((image) => {
    observer.observe(image);
  });
}

