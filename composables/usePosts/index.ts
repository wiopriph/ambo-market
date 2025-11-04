import type { Filters, Location, InitializeFilters } from './types';
import { DEFAULT_LOCATION, DEFAULT_FILTERS, MAX_POSTS_PER_PAGE } from './constants';
import usePostApi from './hooks';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { getCityIdByName } from '~/constants/cities';


export function usePosts() {
  const { GET_POSTS } = usePostApi();

  const locationCookie = useCookie<Location>('location', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  const location = useState<Location>('location', () => DEFAULT_LOCATION);
  const locationName = computed(() => location.value.displayName);

  const cityId = computed(() => getCityIdByName(location.value?.city));
  const isPriorityCity = computed(() => cityId.value !== 'all');
  const coords = computed(() => ({
    latitude: location.value.lat,
    longitude: location.value.lon,
    radius: location.value.radius,
  }));

  const setLocationInfo = (locationData: Location) => {
    location.value = locationData;
    locationCookie.value = locationData;
  };

  const filters = useState<Filters>('filters', () => DEFAULT_FILTERS);
  const currentFilters = computed(() => getObjectDifferences(filters.value, DEFAULT_FILTERS));
  const hasActiveFilters = computed(() => !!Object.keys(currentFilters.value).length);

  const getFilter = <K extends keyof Filters>(name: K): Filters[K] => filters.value[name];

  const initializeFilters = (data: InitializeFilters) => {
    categoryId.value = data.categoryId;
    subcategoryId.value = data.subcategoryId;
    brandId.value = data.brandId;

    page.value = data.page || 1;
    filters.value = data.filters;
  };


  const page = useState<number>('page', () => 1);
  const categoryId = useState<string>('categoryId', () => '');
  const subcategoryId = useState<string>('subcategoryId', () => '');
  const brandId = useState<string>('brandId', () => '');


  const isLoading = useState<boolean>('isLoading', () => false);


  const fetchPosts = async () => {
    isLoading.value = true;

    try {
      return await GET_POSTS({
        categoryId: categoryId.value,
        subcategoryId: subcategoryId.value,
        brandId: brandId.value,
        latitude: location.value.lat,
        longitude: location.value.lon,
        radius: location.value.radius,
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        search: filters.value.q,
        page: page.value,
        limit: MAX_POSTS_PER_PAGE,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while getting posts:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    location,
    locationName,
    coords,
    setLocationInfo,

    cityId,
    isPriorityCity,

    filters,
    currentFilters,
    hasActiveFilters,
    getFilter,
    initializeFilters,

    page,
    categoryId,
    subcategoryId,
    brandId,

    isLoading,

    fetchPosts,
  };
}
