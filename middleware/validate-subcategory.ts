import { getCategoryById } from '~/constants/categories';


export default defineNuxtRouteMiddleware((to) => {
  const categoryId = to.params.categoryId as string;
  const subcategoryId = to.params.subcategoryId as string;

  if (!subcategoryId) {
    return;
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid category' });
  }

  const isValidSubcategory = category.subcategories?.some(
    sub => sub.id === subcategoryId,
  );

  if (!isValidSubcategory) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid subcategory' });
  }
});
