import { TYPES } from '~/constants/categories';


export default defineNuxtRouteMiddleware((to) => {
  const categoryId = to.params.categoryId as string;

  // @todo: добавить 301 редиректы с удаленых категорий на новые

  if (!TYPES.includes(categoryId)) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid category' });
  }
});
