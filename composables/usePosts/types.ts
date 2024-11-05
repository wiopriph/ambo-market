export interface Filters {
  q: string;
  minPrice: number | string;
  maxPrice: number | string;
  safeTransaction: boolean;
  period: string;
}

export interface Location {
  lat: number | null;
  lon: number | null;
  city: string;
  displayName: string;
  radius: string | number | null;
}

export interface InitializeFilters {
  filters: Filters;
  page: number;
  categoryId: string;
}


export interface LocationCoords {
  latitude: number | null;
  longitude: number | null;
  radius: string | number | null;
}

export interface DatePublished {
  from: number | null;
  to: number | null;
}

export interface FetchPostsParams {
  category: string | string[] | null;
  location: LocationCoords;
  datePublished: DatePublished;
  minPrice: number | string;
  maxPrice: number | string;
  search: string;
  page: number;
  limit: number;
}
