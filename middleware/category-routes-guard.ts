import { TYPES } from '~/constants/categories';


export default defineNuxtRouteMiddleware((to) => {
  const categoryId = to.params.categoryId as string;

  if (!TYPES.includes(categoryId)) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid category' });
  }
});
