import { DEFAULT_FILTERS } from '~/composables/usePosts/constants';
import { usePosts } from '~/composables/usePosts';


export default defineNuxtRouteMiddleware((to) => {
  const { initializeFilters } = usePosts();

  const params = to.params;
  const query = to.query;


  const categoryId = params.categoryId as string || '';
  const subcategoryId = params.subcategoryId as string || '';
  const brandId = params.brandId as string || '';

  const page = parseInt(query.page as string) || 1;

  const minPrice = parseInt(query.minPrice as string) || DEFAULT_FILTERS.minPrice;
  const maxPrice = parseInt(query.maxPrice as string) || DEFAULT_FILTERS.maxPrice;

  const filters = {
    q: query.q as string || '',
    minPrice,
    maxPrice,
  };

  const attrs: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('attr_') && typeof value === 'string' && value) {
      attrs[key] = value;
    }
  }

  return initializeFilters({
    categoryId,
    subcategoryId,
    brandId,

    filters,
    page,
    attrs,
  });
});
