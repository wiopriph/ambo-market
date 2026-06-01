import type {
  Filters,
  Location,
} from './types';


export const MAX_POSTS_PER_PAGE = 20;

export const DEFAULT_FILTERS: Filters = {
  q: '',
  minPrice: '',
  maxPrice: '',
};

export const DEFAULT_LOCATION: Location = {
  cityId: 'all',
  cityName: '',
};
