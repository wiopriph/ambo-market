interface Category {
  id: string;
  key: string;
  img: string;
  subcategories?: {
    id: string;
    key: string;
    brands?: {
      id: string;
      key: string
    }[];
  }[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'vehicles',
    img: '/images/categories/vehicles.png',
    key: 'categories.vehicles',
    subcategories: [
      {
        id: 'cars',
        key: 'subcategories.cars',
        brands: [
          {
            id: 'other',
            key: 'brands.other',
          },
          {
            id: 'toyota',
            key: 'brands.toyota',
          },
          {
            id: 'suzuki',
            key: 'brands.suzuki',
          },
          {
            id: 'hyundai',
            key: 'brands.hyundai',
          },
          {
            id: 'kia',
            key: 'brands.kia',
          },
          {
            id: 'mitsubishi',
            key: 'brands.mitsubishi',
          },
          {
            id: 'chevrolet',
            key: 'brands.chevrolet',
          },
          {
            id: 'nissan',
            key: 'brands.nissan',
          },
          {
            id: 'renault',
            key: 'brands.renault',
          },
          {
            id: 'ford',
            key: 'brands.ford',
          },
          {
            id: 'mercedes',
            key: 'brands.mercedes',
          },
          {
            id: 'volkswagen',
            key: 'brands.volkswagen',
          },
          {
            id: 'bmw',
            key: 'brands.bmw',
          },
          {
            id: 'jetour',
            key: 'brands.jetour',
          },
        ],
      },
      {
        id: 'motorcycles',
        key: 'subcategories.motorcycles',
        brands: [
          {
            id: 'other',
            key: 'brands.other',
          },
          {
            id: 'honda',
            key: 'brands.honda',
          },
          {
            id: 'yamaha',
            key: 'brands.yamaha',
          },
          {
            id: 'suzuki',
            key: 'brands.suzuki',
          },
          {
            id: 'kawasaki',
            key: 'brands.kawasaki',
          },
          {
            id: 'vespa',
            key: 'brands.vespa',
          },
          {
            id: 'ducati',
            key: 'brands.ducati',
          },
          {
            id: 'bmw-motorrad',
            key: 'brands.bmw-motorrad',
          },
          {
            id: 'harley-davidson',
            key: 'brands.harley-davidson',
          },
          {
            id: 'aprilia',
            key: 'brands.aprilia',
          },
        ],
      },
      {
        id: 'commercial',
        key: 'subcategories.commercial',
      },
      {
        id: 'boats',
        key: 'subcategories.boats',
      },
      {
        id: 'parts',
        key: 'subcategories.parts',
      },
    ],
  },
  {
    id: 'real-estate',
    key: 'categories.real-estate',
    img: '/images/categories/real-estate.png',
    subcategories: [
      {
        id: 'rent',
        key: 'subcategories.rent',
      },
      {
        id: 'sale',
        key: 'subcategories.sale',
      },
      {
        id: 'commercial',
        key: 'subcategories.commercial',
      },
      {
        id: 'land',
        key: 'subcategories.land',
      },
    ],
  },
  {
    id: 'electronics',
    key: 'categories.electronics',
    img: '/images/categories/electronics.png',
    subcategories: [
      {
        id: 'phones',
        key: 'subcategories.phones',
        brands: [
          {
            id: 'other',
            key: 'brands.other',
          },
          {
            id: 'apple',
            key: 'brands.apple',
          },
          {
            id: 'samsung',
            key: 'brands.samsung',
          },
          {
            id: 'itel',
            key: 'brands.itel',
          },
          {
            id: 'tecno',
            key: 'brands.tecno',
          },
          {
            id: 'xiaomi',
            key: 'brands.xiaomi',
          },
          {
            id: 'huawei',
            key: 'brands.huawei',
          },
          {
            id: 'oppo',
            key: 'brands.oppo',
          },
        ],
      },
      {
        id: 'computers',
        key: 'subcategories.computers',
        brands: [
          {
            id: 'other',
            key: 'brands.other',
          },
          {
            id: 'hp',
            key: 'brands.hp',
          },
          {
            id: 'dell',
            key: 'brands.dell',
          },
          {
            id: 'asus',
            key: 'brands.asus',
          },
          {
            id: 'lenovo',
            key: 'brands.lenovo',
          },
          {
            id: 'apple',
            key: 'brands.apple',
          },
          {
            id: 'acer',
            key: 'brands.acer',
          },
          {
            id: 'msi',
            key: 'brands.msi',
          },
          {
            id: 'huawei',
            key: 'brands.huawei',
          },
        ],
      },
      {
        id: 'gaming',
        key: 'subcategories.gaming',
        brands: [
          { id: 'sony', key: 'brands.sony' },
          { id: 'microsoft', key: 'brands.microsoft' },
          { id: 'nintendo', key: 'brands.nintendo' },
          { id: 'valve', key: 'brands.valve' },
          { id: 'other', key: 'brands.other' },
        ],
      },
      {
        id: 'tv-audio-photo',
        key: 'subcategories.tv-audio-photo',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
      },
      {
        id: 'accessories-electronics',
        key: 'subcategories.accessories-electronics',
      },
    ],
  },
  {
    id: 'fashion',
    key: 'categories.fashion',
    img: '/images/categories/fashion.png',
    subcategories: [
      {
        id: 'men',
        key: 'subcategories.men',
      },
      {
        id: 'women',
        key: 'subcategories.women',
      },
      {
        id: 'shoes',
        key: 'subcategories.shoes',
      },
      {
        id: 'bags',
        key: 'subcategories.bags',
      },
      {
        id: 'accessories-fashion',
        key: 'subcategories.accessories-fashion',
      },
      {
        id: 'beauty-products',
        key: 'subcategories.beauty-products',
      },
    ],
  },
  {
    id: 'jobs',
    key: 'categories.jobs',
    img: '/images/categories/jobs.png',
    subcategories: [
      {
        id: 'vacancies',
        key: 'subcategories.vacancies',
      },
      {
        id: 'resumes',
        key: 'subcategories.resumes',
      },
    ],
  },
  {
    id: 'services',
    key: 'categories.services',
    img: '/images/categories/services.png',
    subcategories: [
      {
        id: 'construction',
        key: 'subcategories.construction',
      },
      {
        id: 'it-dev',
        key: 'subcategories.it-dev',
      },
      {
        id: 'education',
        key: 'subcategories.education',
      },
      {
        id: 'beauty',
        key: 'subcategories.beauty',
      },
      {
        id: 'other-services',
        key: 'subcategories.other-services',
      },
    ],
  },
  {
    id: 'animals',
    key: 'categories.animals',
    img: '/images/categories/animals.png',
    subcategories: [
      {
        id: 'pets',
        key: 'subcategories.pets',
      },
      {
        id: 'other-animals',
        key: 'subcategories.other-animals',
      },
      {
        id: 'supplies',
        key: 'subcategories.supplies',
      },
    ],
  },
  {
    id: 'hobby',
    key: 'categories.hobby',
    img: '/images/categories/hobby.png',
    subcategories: [
      {
        id: 'sport',
        key: 'subcategories.sport',
      },
      {
        id: 'music',
        key: 'subcategories.music',
      },
      {
        id: 'games',
        key: 'subcategories.games',
      },
      {
        id: 'collectibles',
        key: 'subcategories.collectibles',
      },
      {
        id: 'other-hobby',
        key: 'subcategories.other-hobby',
      },
    ],
  },
  {
    id: 'kids',
    key: 'categories.kids',
    img: '/images/categories/kids.png',
    subcategories: [
      {
        id: 'clothes',
        key: 'subcategories.clothes',
      },
      {
        id: 'toys',
        key: 'subcategories.toys',
      },
      {
        id: 'furniture',
        key: 'subcategories.furniture',
      },
      {
        id: 'other-kids',
        key: 'subcategories.other-kids',
      },
    ],
  },
  {
    id: 'home',
    key: 'categories.home',
    img: '/images/categories/home.png',
    subcategories: [
      {
        id: 'furniture',
        key: 'subcategories.furniture',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
      },
      {
        id: 'tools',
        key: 'subcategories.tools',
      },
      {
        id: 'decor',
        key: 'subcategories.decor',
      },
      {
        id: 'other-home',
        key: 'subcategories.other-home',
      },
    ],
  },
];

const categoryMap = new Map<string, Category>(CATEGORIES.map(category => [category.id, category]));

export const TYPES: string[] = [...categoryMap.keys()];

/**
 * Поиск категории по categoryId
 * @param categoryId - id категории
 * @returns {Category | undefined} Возвращает объект категории или undefined, если не найдена.
 */
export function getCategoryById(categoryId: string): Category | undefined {
  return categoryMap.get(categoryId);
}
