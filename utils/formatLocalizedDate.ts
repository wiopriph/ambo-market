import { format, isSameDay, isThisYear } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';


const locales = {
  en: enUS,
  pt: ptBR,
};

/**
 * Форматирование timestamp в строку с датой и временем в зависимости от локали.
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
  const date = new Date(timestamp);
  const today = new Date();
  const selectedLocale = locales[locale as 'en' | 'pt'] || enUS;

  if (isSameDay(date, today)) {
    return format(date, 'HH:mm', { locale: selectedLocale });
  }

  if (isThisYear(date)) {
    return format(date, 'dd MMMM HH:mm', { locale: selectedLocale });
  }

  return format(date, 'dd MMMM yyyy', { locale: selectedLocale });
}
