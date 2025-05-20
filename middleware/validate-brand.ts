import { getCategoryById } from '~/constants/categories';


export default defineNuxtRouteMiddleware((to) => {
  const categoryId = to.params.categoryId as string;
  const subcategoryId = to.params.subcategoryId as string;
  const brandId = to.params.brandId as string;

  if (!brandId) {
    return;
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid category' });
  }

  const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);

  if (!subcategory) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid subcategory' });
  }

  const isValidBrand = subcategory.brands?.some(brand => brand.id === brandId);

  if (!isValidBrand) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid brand' });
  }
});
