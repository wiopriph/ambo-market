import type {
  Filters,
  Location,
} from './types';


export const MAX_POSTS_PER_PAGE = 20;

export const DEFAULT_FILTERS: Filters = {
  q: '',
  minPrice: '',
  maxPrice: '',
  safeTransaction: false,
};

export const DEFAULT_LOCATION: Location = {
  lat: null,
  lon: null,
  city: '',
  displayName: '',
  radius: '',
};
