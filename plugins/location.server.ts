import { usePosts } from '~/composables/usePosts';
import type { Location } from '~/composables/usePosts/types';

/**
 * Проверяет валидность данных о локации.
 *
 * @param {Object} data - Объект с данными о локации
 * @param {number|null} data.lat - Широта
 * @param {number|null} data.lon - Долгота
 * @param {string} data.city - Название города
 * @param {string} data.displayName - Отображаемое название
 * @param {number|null} data.radius - Радиус (может быть null)
 *
 * @returns {boolean} - true, если данные о локации валидны, в противном случае - false.
 */
function isValidLocationData(data: any): boolean {
  return (
    data &&
        typeof data.lat === 'number' &&
        typeof data.lon === 'number' &&
        typeof data.city === 'string' &&
        typeof data.displayName === 'string' &&
        (data.radius === null ||
            typeof data.radius === 'string' ||
            typeof data.radius === 'number')
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
