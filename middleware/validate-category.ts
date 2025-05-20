import { TYPES } from '~/constants/categories';


const REDIRECT_CATEGORY_MAP: Record<string, string> = {
  transport: 'vehicles',
  clothing: 'fashion',
  other: 'hobby',
  job: 'jobs',
  'auto-parts': 'vehicles',
  'beauty-health': 'fashion',
  'childrens-goods': 'kids',
  'for-home': 'home',
  'building-materials': 'home',
  'for-business': 'home',
};

export default defineNuxtRouteMiddleware((to) => {
  const categoryId = to.params.categoryId as string;

  if (!TYPES.includes(categoryId)) {
    const newCategoryId = REDIRECT_CATEGORY_MAP[categoryId];

    if (newCategoryId) {
      return navigateTo({
        ...to,
        params: {
          ...to.params,
          categoryId: newCategoryId,
        },
      }, { redirectCode: 301 });
    }

    throw createError({ statusCode: 404, statusMessage: 'Invalid category' });
  }
});
