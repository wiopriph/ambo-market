import { getCityById } from '~/constants/cities';
import { usePosts } from '~/composables/usePosts';


export default defineNuxtRouteMiddleware((to) => {
  const {
    cityId,
    setLocationInfo,
  } = usePosts();

  const routeCityId = to.params.cityId as string;


  if (routeCityId !== cityId.value) {
    // @todo: БАГ - перебивает при обновлении страницы сетап клиент - нужно переделать на куки
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
