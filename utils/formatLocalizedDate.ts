import { useDayjs } from '#dayjs';


const dayjs = useDayjs();

/**
 * Форматирует timestamp в строку с датой и временем в зависимости от локали.
 * Если дата — сегодняшняя, отображается только время, если в этом году — дата с месяцем и временем,
 * если в прошлом году — полный формат даты.
 *
 * @param {number} timestamp - Время в формате timestamp (миллисекунды с 1970 года).
 * @param {string} locale - Локаль для форматирования (например, 'en', 'pt').
 *
 * @returns {string} - Строка, представляющая форматированную дату и время.
 *
 * @example
 * const formattedDate = formatLocalizedDate(1635464234000, 'en');
 * console.log(formattedDate); // "10:47 PM" (если сегодня) или "30 October 10:47 PM" (если в этом году) или "30 October 2021" (если в прошлом году)
 */
export default function formatLocalizedDate(timestamp: number, locale: string): string {
  dayjs.locale(locale);

  const date = dayjs(timestamp);
  const today = dayjs();
  const thisYear = today.year();
  const isToday = date.isSame(today, 'day');
  const isThisYear = date.year() === thisYear;

  if (isToday) {
    return date.format('HH:mm');
  }

  if (isThisYear) {
    return date.format('DD MMMM HH:mm');
  }

  return date.format('DD MMMM YYYY');
}
