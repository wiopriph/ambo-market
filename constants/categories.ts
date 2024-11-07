interface Category {
  type: string;
  img: string;
}

export const CATEGORIES: Category[] = [
  {
    type: 'electronics',
    img: '/images/categories/electronics.png',
  },
  {
    type: 'clothing',
    img: '/images/categories/clothing.png',
  },
  {
    type: 'transport',
    img: '/images/categories/transport.png',
  },
  {
    type: 'auto-parts',
    img: '/images/categories/auto-parts.png',
  },
  {
    type: 'beauty-health',
    img: '/images/categories/beauty-health.png',
  },
  {
    type: 'real-estate',
    img: '/images/categories/real-estate.png',
  },
  {
    type: 'childrens-goods',
    img: '/images/categories/childrens-goods.png',
  },
  {
    type: 'job',
    img: '/images/categories/job.png',
  },
  {
    type: 'services',
    img: '/images/categories/services.png',
  },
  {
    type: 'building-materials',
    img: '/images/categories/building-materials.png',
  },
  {
    type: 'animals',
    img: '/images/categories/animals.png',
  },
  {
    type: 'for-business',
    img: '/images/categories/for-business.png',
  },
  {
    type: 'for-home',
    img: '/images/categories/for-home.png',
  },
  {
    type: 'other',
    img: '/images/categories/other.png',
  },
];

const categoryMap = new Map<string, Category>(CATEGORIES.map(category => [category.type, category]));

export const TYPES: string[] = [...categoryMap.keys()];

/**
 * Поиск категории по categoryId
 * @param categoryId - id категории
 * @returns {Category | undefined} Возвращает объект категории или undefined, если не найдена.
 */
export function getCategoryById(categoryId: string): Category | undefined {
  return categoryMap.get(categoryId);
}
