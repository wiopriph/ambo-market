/**
 * Функция, которая превращает строку в id
 * @param str - исходная строка
 * @returns {string} Преобразованный id
 */
export default function(str: string): string {
  const sanitizedString = str.replace(/[^\w\s]/gi, '');

  return sanitizedString.toLowerCase().replace(/\s+/g, '-');
}
