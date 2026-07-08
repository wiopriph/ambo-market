export interface Filters {
  q: string;
  minPrice: number | string;
  maxPrice: number | string;
}

export interface Location {
  cityId: string;
  cityName: string;
}

export interface InitializeFilters {
  filters: Filters;
  page: number;
  categoryId: string;
  subcategoryId: string;
  brandId: string;
  // атрибутные фильтры в формате query-параметров: { attr_fuel: 'diesel,gasoline', attr_year_min: '2015' }
  attrs: Record<string, string>;
}


export interface FetchPostsParams {
  categoryId: string;
  subcategoryId: string;
  brandId: string;
  cityId: string;
  minPrice: number | string;
  maxPrice: number | string;
  search: string;
  page: number;
  limit: number;
  [attrParam: `attr_${string}`]: string;
}

export interface Post {
  id: string;
  createdAt: number;
  preview: string;
  images: string[];
  price: number;
  description: string;
  location: Location;
  title: string;
  userId: string;
  categoryId: string;
  subcategoryId: string;
  brandId?: string;
  status: string;
}

export interface PostsResponse {
  posts: Post[];
  resultsCount: number;
  page: number;
}
