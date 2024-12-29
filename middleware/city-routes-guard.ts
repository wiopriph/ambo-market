import { CITIES_IDS } from '~/constants/cities';


const VALID_CITY_ID_REGEX = /^[a-zA-Z-_]+$/;

export default defineNuxtRouteMiddleware((to) => {
  const cityId = to.params.cityId as string;

  if (to.name === 'cityId' && cityId === 'all') {
    // Редирект для 'all'
    return navigateTo({ name: 'index' });
  }

  if (!VALID_CITY_ID_REGEX.test(cityId)) {
    // Проверка на соответствие регулярному выражению
    throw createError({ statusCode: 404, statusMessage: 'Invalid city ID' });
  }

  if (!CITIES_IDS.includes(cityId)) {
    // Редирект на страницу городов, если cityId не найден
    return navigateTo({ name: 'cities' });
  }
});
