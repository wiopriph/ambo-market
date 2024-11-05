import type { Filters, Location, InitializeFilters } from './types';
import usePostApi from './hooks';
import { DEFAULT_LOCATION, DEFAULT_FILTERS } from './constants';
import generateDatePublished from '~/utils/generateDatePublished';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { getCityIdByName } from '~/constants/cities';


const MAX_POSTS_PER_PAGE = 10;

export function usePost() {
  const { GET_POSTS } = usePostApi();


  const location = useState<Location>('location', () => (DEFAULT_LOCATION as Location));
  const locationName = computed(() => location.value.displayName);
  const cityId = computed(() => getCityIdByName(location.value.city));
  const coords = computed(() => ({
    latitude: location.value.lat,
    longitude: location.value.lon,
    radius: location.value.radius,
  }));

  const setLocationInfo = (locationData: Location) => {
    location.value = locationData;

    // cookies.set('location', locationData, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  };


  const filters = useState<Filters>('filters', () => (DEFAULT_FILTERS as Filters));
  const currentFilters = computed(() => getObjectDifferences(filters.value, DEFAULT_FILTERS));
  const isFindActive = computed(() => !!Object.keys(currentFilters.value).length || page.value > 1);


  const getFilter = <K extends keyof Filters>(name: K): Filters[K] => filters.value[name];

  const initializeFilters = async (data: InitializeFilters) => {
    categoryId.value = data.categoryId;
    page.value = data.page || 1;
    filters.value = data.filters;


    return await fetchPosts();
  };

  const page = useState<number>('page', () => 1);
  const categoryId = useState<string | string[] | null>('categoryId', () => null);


  const isLoading = useState<boolean>('isLoading', () => false);


  const posts = useState('posts', () => []);
  const postsCount = useState<number>('postsCount', () => 0);
  const totalPages = computed(() => Math.ceil(postsCount.value / MAX_POSTS_PER_PAGE));

  const fetchPosts = async () => {
    isLoading.value = true;

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      const result = await GET_POSTS({
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

      posts.value = result?.posts;
      postsCount.value = result?.resultsCount;
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
    cityId,
    coords,
    setLocationInfo,

    filters,
    currentFilters,
    isFindActive,
    getFilter,
    initializeFilters,

    page,
    categoryId,

    isLoading,

    posts,
    postsCount,
    totalPages,
    fetchPosts,
  };
}
