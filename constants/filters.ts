
export const PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  ALL: 'all',
};

export const DEFAULT_FILTERS = {
  q: '',
  minPrice: '',
  maxPrice: '',
  safeTransaction: false,
  period: PERIODS.ALL,
};

export type PeriodsKeys = keyof typeof PERIODS;
export type PeriodsValues = typeof PERIODS[PeriodsKeys];
