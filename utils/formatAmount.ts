/**
 * Функция для преобразования суммы к формату 2 000 000.00
 *
 * @param {number | string} value - число для преобразования
 * @param {number} digits - количество цифр после десятичной запятой
 * @param {string} separator - разделитель
 * @returns {string} - возвращает отформатированную строку 2 000 000.00
 */
export default function(value: number | string, digits = 2, separator = '\xA0'): string {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (!value) {
    return '0';
  }

  const result = value.toFixed(digits).split('')
    .reverse();

  let i = result.indexOf('.') + 4;

  for (; i < result.length; i += 4) {
    result.splice(i, 0, separator);
  }

  return result.reverse().join('');
}
