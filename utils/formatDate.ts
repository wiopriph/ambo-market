const LOCALES = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
};

/**
 * Форматирует timestamp в строку с датой и временем в зависимости от локали.
 * Если дата — сегодняшняя, отображается только время.
 * Если дата в этом году — отображается день, месяц и время.
 * Если дата в прошлом году — отображается день, месяц и год.
 *
 * @param {number} timestamp - Время в формате timestamp (миллисекунды с 1970 года).
 * @param {'en' | 'pt'} locale - Локаль для форматирования ('en' или 'pt').
 * @returns {string} - Отформатированная дата.
 */
function formatLocalizedDate(timestamp, locale = 'en') {
  const date = new Date(timestamp);
  const today = new Date();
  const monthNames = LOCALES[locale] || LOCALES.en;

  const isSameDay = date.toDateString() === today.toDateString();
  const isThisYear = date.getFullYear() === today.getFullYear();

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const time = date.toTimeString().slice(0, 5); // HH:mm

  if (isSameDay) {
    return time;
  }

  if (isThisYear) {
    return `${day} ${month} ${time}`;
  }

  return `${day} ${month} ${year}`;
}

/**
 * Всегда форматирует timestamp в строку "день месяц год" в зависимости от локали.
 *
 * @param {number} timestamp - Время в формате timestamp (миллисекунды с 1970 года).
 * @param {'en' | 'pt'} locale - Локаль для форматирования ('en' или 'pt').
 * @returns {string} - Отформатированная дата в формате "день месяц год".
 */
function formatFullDate(timestamp, locale = 'en') {
  const date = new Date(timestamp);
  const monthNames = LOCALES[locale] || LOCALES.en;

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export { formatLocalizedDate, formatFullDate };
