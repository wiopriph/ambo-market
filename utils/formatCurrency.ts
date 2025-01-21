import { CURRENCY } from '~/constants/currency';

/**
 * Форматирование денежной суммы под локаль и валюту
 *
 * @param {number | string} value - число для форматирования
 * @param {number} fractionDigits - количество знаков после запятой
 * @param {'currency' | 'decimal'} style - decimal - без валютного знака
 * @param {string} locale - локаль ('en-US', 'pt-PT', и т.д.)
 * @returns {string | number} отформатированное значение или оригинал
 */
export default function(
  value: string | number,
  fractionDigits = 0,
  style: 'currency' | 'decimal' = 'currency',
  locale = 'pt-PT',
): string | number {
  const fraction: number = Number.isInteger(fractionDigits) && fractionDigits >= 0 ? fractionDigits : 2;

  const options: Intl.NumberFormatOptions = {
    currency: CURRENCY,
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
    style,
  };

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return value;
  }

  const numberFormat = new Intl.NumberFormat(locale, options);

  return numberFormat.format(numericValue);
}
