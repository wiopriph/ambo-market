import { PERIODS } from '~/constants/filters';


interface DatePublished {
  from: number | null;
  to: number | null;
}

/**
 * Генерирует объект `datePublished` на основе выбранного периода.
 *
 * @param {keyof typeof PERIODS} period - Выбранный период (PERIODS.DAY, PERIODS.WEEK, и т. д.).
 * @returns {DatePublished} Объект `datePublished` с начальной и конечной датой в миллисекундах.
 */
export default function generateDatePublished(period: keyof typeof PERIODS): DatePublished {
  const now = new Date();

  const createDateFromNow = (daysAgo: number): number => {
    const fromDate = new Date(now);

    fromDate.setDate(now.getDate() - daysAgo);

    return fromDate.getTime();
  };

  if (period === PERIODS.DAY) {
    return {
      from: createDateFromNow(1),
      to: now.getTime(),
    };
  }

  if (period === PERIODS.WEEK) {
    return {
      from: createDateFromNow(7),
      to: now.getTime(),
    };
  }

  return { from: null, to: null };
}
