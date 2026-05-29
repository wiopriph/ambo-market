import { usePosts } from '~/composables/usePosts';
import type { Location } from '~/composables/usePosts/types';

/**
 * Проверяет валидность данных о локации.
 *
 * @param {Object} data - Объект с данными о локации
 * @param {string} data.cityId - Slug/id города
 * @param {string} data.cityName - Название города
 *
 * @returns {boolean} - true, если данные о локации валидны, в противном случае - false.
 */
function isValidLocationData(data: any): boolean {
  return (
    data &&
        typeof data.cityId === 'string' &&
        typeof data.cityName === 'string'
  );
}


export default defineNuxtPlugin(() => {
  const locationCookie = useCookie<Location | null>('location');

  const locationData = locationCookie.value;

  const { setLocationInfo } = usePosts();

  if (locationData && isValidLocationData(locationData)) {
    setLocationInfo(locationData);
  } else {
    locationCookie.value = null;
  }
});
