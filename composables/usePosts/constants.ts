import type {
  Filters,
  Location,
} from './types';


export const PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  ALL: 'all',
};

export const DEFAULT_FILTERS: Filters = {
  q: '',
  minPrice: '',
  maxPrice: '',
  safeTransaction: false,
  period: PERIODS.ALL,
};

export const DEFAULT_LOCATION: Location = {
  lat: null,
  lon: null,
  city: '',
  displayName: '',
  radius: '',
};
