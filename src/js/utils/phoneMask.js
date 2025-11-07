/**
 * Применяет маску телефона к полю ввода
 * Формат: +7 (000) 000-00-00
 * @param {HTMLInputElement} input - Элемент input
 */
export function applyPhoneMask(input) {
  let value = input.value.replace(/\D/g, '');
  
  // Заменяем 8 на 7 в начале
  if (value.startsWith('8')) {
    value = '7' + value.slice(1);
  }
  
  // Добавляем 7 в начало, если его нет
  if (!value.startsWith('7')) {
    value = '7' + value;
  }
  
  // Ограничиваем длину 11 цифрами
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  // Форматируем значение
  let formattedValue = '+7';
  if (value.length > 1) {
    formattedValue += ` (${value.slice(1, 4)}`;
  }
  if (value.length >= 4) {
    formattedValue += `) ${value.slice(4, 7)}`;
  }
  if (value.length >= 7) {
    formattedValue += `-${value.slice(7, 9)}`;
  }
  if (value.length >= 9) {
    formattedValue += `-${value.slice(9, 11)}`;
  }
  
  input.value = formattedValue;
}
