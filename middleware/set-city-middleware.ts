import { getCityById } from '~/constants/cities';
import { usePosts } from '~/composables/usePosts';


export default defineNuxtRouteMiddleware((to) => {
  const {
    cityId,
    setLocationInfo,
  } = usePosts();

  const routeCityId = to.params.cityId as string;

  if (routeCityId !== cityId.value) {
    const defaultCityInfo = getCityById(routeCityId);

    if (defaultCityInfo) {
      return setLocationInfo({
        city: defaultCityInfo.name,
        displayName: defaultCityInfo.name,
        lat: defaultCityInfo.lat,
        lon: defaultCityInfo.lon,
        radius: null,
      });
    }
  }
});
