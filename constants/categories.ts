interface Category {
  type: string;
  label: string;
  img: string;
}

export const CATEGORIES: Category[] = [
  {
    type: 'electronics',
    label: 'Electronics and Appliances',
    img: '/images/categories/electronics.png',
  },
  {
    type: 'clothing',
    label: 'Clothing',
    img: '/images/categories/clothing.png',
  },
  {
    type: 'transport',
    label: 'Transport',
    img: '/images/categories/transport.png',
  },
  {
    type: 'auto-parts',
    label: 'Parts and Auto Products',
    img: '/images/categories/auto-parts.png',
  },
  {
    type: 'beauty-health',
    label: 'Beauty and Health',
    img: '/images/categories/beauty-health.png',
  },
  {
    type: 'real-estate',
    label: 'Real Estate',
    img: '/images/categories/real-estate.png',
  },
  {
    type: 'childrens-goods',
    label: 'Children\'s Goods',
    img: '/images/categories/childrens-goods.png',
  },
  {
    type: 'job',
    label: 'Job',
    img: '/images/categories/job.png',
  },
  {
    type: 'services',
    label: 'Services',
    img: '/images/categories/services.png',
  },
  {
    type: 'building-materials',
    label: 'Building Materials',
    img: '/images/categories/building-materials.png',
  },
  {
    type: 'animals',
    label: 'Animals',
    img: '/images/categories/animals.png',
  },
  {
    type: 'for-business',
    label: 'For Business',
    img: '/images/categories/for-business.png',
  },
  {
    type: 'for-home',
    label: 'For Home',
    img: '/images/categories/for-home.png',
  },
  {
    type: 'other',
    label: 'Other',
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
