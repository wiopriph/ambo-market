/**
 * Форматирует timestamp в строку с датой и временем в зависимости от локали.
 * Если дата — сегодняшняя, отображается только время, если нет — полный формат даты и времени.
 *
 * @param {number} timestamp - Время в формате timestamp (миллисекунды с 1970 года).
 * @param {string} locale - Локаль для форматирования (например, 'en', 'pt').
 *
 * @returns {string} - Строка, представляющая форматированную дату и время.
 *
 * @example
 * const formattedDate = formatLocalizedDate(1635464234000, 'en');
 * console.log(formattedDate); // "10:47 PM" (если сегодня) или "October 30, 2021, 10:47 PM"
 */
export default function formatLocalizedDate(timestamp: number, locale: string): string {
  const date = new Date(timestamp);
  const today = new Date();


  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
