import formatAmount from '~/utils/formatAmount';
import { CURRENCY } from '~/constants/currency';

/**
 * Преобразование цены к формату 2 000 000.00 + Currency
 *
 * @param {number | string} value - число для преобразования
 * @param {number} digits - количество цифр после десятичной запятой
 * @param {string} separator - разделитель
 * @returns {string} - возвращает отформатированную строку 2 000 000.00 + Currency
 */
export default function(value: number | string, digits = 0, separator = '\xA0'): string {
  const amount = formatAmount(value, digits, separator);

  if (amount) {
    return `${amount} ${CURRENCY}`;
  }

  return amount;
}
