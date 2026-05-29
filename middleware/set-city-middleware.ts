import { getCityById } from '~/constants/cities';
import { usePosts } from '~/composables/usePosts';


export default defineNuxtRouteMiddleware((to) => {
  const {
    cityId,
    setCity,
  } = usePosts();

  const routeCityId = to.params.cityId as string;

  if (routeCityId !== cityId.value) {
    if (getCityById(routeCityId)) {
      return setCity(routeCityId);
    }
  }
});
