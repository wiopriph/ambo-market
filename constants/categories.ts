interface Category {
  id: string;
  key: string;
  icon: string;
  subcategories?: {
    id: string;
    key: string;
    icon: string;
    brands?: {
      id: string;
      key: string
    }[];
  }[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'vehicles',
    icon: 'i-lucide-car',
    key: 'categories.vehicles',
    subcategories: [
      {
        id: 'cars',
        key: 'subcategories.cars',
        icon: 'i-lucide-car',
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
        icon: 'i-lucide-bike',
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
        icon: 'i-lucide-truck',
      },
      {
        id: 'boats',
        key: 'subcategories.boats',
        icon: 'i-lucide-ship',
      },
      {
        id: 'parts',
        key: 'subcategories.parts',
        icon: 'i-lucide-cog',
      },
    ],
  },

  {
    id: 'real-estate',
    key: 'categories.real-estate',
    icon: 'i-lucide-house',
    subcategories: [
      {
        id: 'rent',
        key: 'subcategories.rent',
        icon: 'i-lucide-key-round',
      },
      {
        id: 'sale',
        key: 'subcategories.sale',
        icon: 'i-lucide-badge-dollar-sign',
      },
      {
        id: 'commercial-property',
        key: 'subcategories.commercial-property',
        icon: 'i-lucide-building-2',
      },
      {
        id: 'land',
        key: 'subcategories.land',
        icon: 'i-lucide-map',
      },
    ],
  },

  {
    id: 'electronics',
    key: 'categories.electronics',
    icon: 'i-lucide-smartphone',
    subcategories: [
      {
        id: 'phones',
        key: 'subcategories.phones',
        icon: 'i-lucide-smartphone',
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
        icon: 'i-lucide-laptop',
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
        icon: 'i-lucide-gamepad-2',
        brands: [
          {
            id: 'sony',
            key: 'brands.sony',
          },
          {
            id: 'microsoft',
            key: 'brands.microsoft',
          },
          {
            id: 'nintendo',
            key: 'brands.nintendo',
          },
          {
            id: 'valve',
            key: 'brands.valve',
          },
          {
            id: 'other',
            key: 'brands.other',
          },
        ],
      },
      {
        id: 'tv-audio-photo',
        key: 'subcategories.tv-audio-photo',
        icon: 'i-lucide-tv',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
        icon: 'i-lucide-washing-machine',
      },
      {
        id: 'accessories-electronics',
        key: 'subcategories.accessories-electronics',
        icon: 'i-lucide-cable',
      },
    ],
  },

  {
    id: 'fashion',
    key: 'categories.fashion',
    icon: 'i-lucide-shirt',
    subcategories: [
      {
        id: 'men',
        key: 'subcategories.men',
        icon: 'i-lucide-user-round',
      },
      {
        id: 'women',
        key: 'subcategories.women',
        icon: 'i-lucide-users-round',
      },
      {
        id: 'shoes',
        key: 'subcategories.shoes',
        icon: 'i-lucide-footprints',
      },
      {
        id: 'bags',
        key: 'subcategories.bags',
        icon: 'i-lucide-shopping-bag',
      },
      {
        id: 'accessories-fashion',
        key: 'subcategories.accessories-fashion',
        icon: 'i-lucide-watch',
      },
      {
        id: 'beauty-products',
        key: 'subcategories.beauty-products',
        icon: 'i-lucide-sparkles',
      },
    ],
  },

  {
    id: 'jobs',
    key: 'categories.jobs',
    icon: 'i-lucide-briefcase-business',
    subcategories: [
      {
        id: 'vacancies',
        key: 'subcategories.vacancies',
        icon: 'i-lucide-clipboard-list',
      },
      {
        id: 'resumes',
        key: 'subcategories.resumes',
        icon: 'i-lucide-file-user',
      },
    ],
  },

  {
    id: 'services',
    key: 'categories.services',
    icon: 'i-lucide-wrench',
    subcategories: [
      {
        id: 'construction',
        key: 'subcategories.construction',
        icon: 'i-lucide-hard-hat',
      },
      {
        id: 'it-dev',
        key: 'subcategories.it-dev',
        icon: 'i-lucide-code',
      },
      {
        id: 'education',
        key: 'subcategories.education',
        icon: 'i-lucide-graduation-cap',
      },
      {
        id: 'beauty',
        key: 'subcategories.beauty',
        icon: 'i-lucide-scissors',
      },
      {
        id: 'other-services',
        key: 'subcategories.other-services',
        icon: 'i-lucide-ellipsis',
      },
    ],
  },

  {
    id: 'animals',
    key: 'categories.animals',
    icon: 'i-lucide-paw-print',
    subcategories: [
      {
        id: 'pets',
        key: 'subcategories.pets',
        icon: 'i-lucide-paw-print',
      },
      {
        id: 'other-animals',
        key: 'subcategories.other-animals',
        icon: 'i-lucide-bone',
      },
      {
        id: 'supplies',
        key: 'subcategories.supplies',
        icon: 'i-lucide-package',
      },
    ],
  },

  {
    id: 'hobby',
    key: 'categories.hobby',
    icon: 'i-lucide-palette',
    subcategories: [
      {
        id: 'sport',
        key: 'subcategories.sport',
        icon: 'i-lucide-dumbbell',
      },
      {
        id: 'music',
        key: 'subcategories.music',
        icon: 'i-lucide-music',
      },
      {
        id: 'games',
        key: 'subcategories.games',
        icon: 'i-lucide-dice-5',
      },
      {
        id: 'collectibles',
        key: 'subcategories.collectibles',
        icon: 'i-lucide-trophy',
      },
      {
        id: 'other-hobby',
        key: 'subcategories.other-hobby',
        icon: 'i-lucide-puzzle',
      },
    ],
  },

  {
    id: 'kids',
    key: 'categories.kids',
    icon: 'i-lucide-baby',
    subcategories: [
      {
        id: 'clothes',
        key: 'subcategories.clothes',
        icon: 'i-lucide-shirt',
      },
      {
        id: 'toys',
        key: 'subcategories.toys',
        icon: 'i-lucide-blocks',
      },
      {
        id: 'furniture',
        key: 'subcategories.furniture',
        icon: 'i-lucide-armchair',
      },
      {
        id: 'other-kids',
        key: 'subcategories.other-kids',
        icon: 'i-lucide-baby',
      },
    ],
  },

  {
    id: 'home',
    key: 'categories.home',
    icon: 'i-lucide-house',
    subcategories: [
      {
        id: 'furniture',
        key: 'subcategories.furniture',
        icon: 'i-lucide-sofa',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
        icon: 'i-lucide-washing-machine',
      },
      {
        id: 'tools',
        key: 'subcategories.tools',
        icon: 'i-lucide-hammer',
      },
      {
        id: 'decor',
        key: 'subcategories.decor',
        icon: 'i-lucide-lamp',
      },
      {
        id: 'other-home',
        key: 'subcategories.other-home',
        icon: 'i-lucide-boxes',
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
