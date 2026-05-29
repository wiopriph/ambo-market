export interface Filters {
  q: string;
  minPrice: number | string;
  maxPrice: number | string;
  safeTransaction: boolean;
}

export interface Location {
  cityId: string;
  city: string;
  displayName: string;
}

export interface InitializeFilters {
  filters: Filters;
  page: number;
  categoryId: string;
  subcategoryId: string;
  brandId: string;
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
}

export interface Post {
  id: string;
  createdAt: number;
  preview: string;
  images: string[];
  price: number;
  description: string;
  location: Location;
  isSafeDeal: boolean;
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
