import { PERIODS, DEFAULT_FILTERS } from '~/composables/usePosts/constants';
import { usePosts } from '~/composables/usePosts';


const { initializeFilters } = usePosts();

export default defineNuxtRouteMiddleware((to) => {
  const params = to.params;
  const query = to.query;


  const categoryId = params.categoryId as string || '';

  const page = parseInt(query.page as string) || 1;

  const minPrice = parseInt(query.minPrice as string) || DEFAULT_FILTERS.minPrice;
  const maxPrice = parseInt(query.maxPrice as string) || DEFAULT_FILTERS.maxPrice;
  const period = Object.values(PERIODS).includes(query.period as string) ? query.period as string : DEFAULT_FILTERS.period;
  const safeTransaction = query.safeTransaction === 'true';

  const filters = {
    q: query.q as string || '',
    minPrice,
    maxPrice,
    period,
    safeTransaction,
  };

  return initializeFilters({ filters, page, categoryId });
});
