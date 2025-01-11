import type { Filters, Location, InitializeFilters } from './types';
import { DEFAULT_LOCATION, DEFAULT_FILTERS, MAX_POSTS_PER_PAGE } from './constants';
import usePostApi from './hooks';
import generateDatePublished from '~/utils/generateDatePublished';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { getCityIdByName } from '~/constants/cities';


export function usePosts() {
  const { GET_POSTS } = usePostApi();

  const locationCookie = useCookie<Location>('location', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  const location = useState<Location>('location', () => (DEFAULT_LOCATION as Location));
  const locationName = computed(() => location.value.displayName);

  const cityId = computed(() => getCityIdByName(location.value.city));
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

  const filters = useState<Filters>('filters', () => (DEFAULT_FILTERS as Filters));
  const currentFilters = computed(() => getObjectDifferences(filters.value, DEFAULT_FILTERS));
  const isFindActive = computed(() => !!Object.keys(currentFilters.value).length || page.value > 1);

  const getFilter = <K extends keyof Filters>(name: K): Filters[K] => filters.value[name];

  const initializeFilters = (data: InitializeFilters) => {
    categoryId.value = data.categoryId;
    page.value = data.page || 1;
    filters.value = data.filters;
  };


  const page = useState<number>('page', () => 1);
  const categoryId = useState<string | string[] | null>('categoryId', () => null);


  const isLoading = useState<boolean>('isLoading', () => false);


  const fetchPosts = async () => {
    isLoading.value = true;

    try {
      return await GET_POSTS({
        category: categoryId.value,
        location: {
          latitude: location.value.lat,
          longitude: location.value.lon,
          radius: location.value.radius,
        },
        datePublished: generateDatePublished(filters.value.period),
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
    isFindActive,
    getFilter,
    initializeFilters,

    page,
    categoryId,

    isLoading,

    fetchPosts,
  };
}
