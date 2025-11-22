interface Category {
  id: string;
  key: string;
  img: string;
  hasSafeDeal?: boolean;
  subcategories?: {
    id: string;
    key: string;
    img: string;
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
        img: '/images/categories/cars.png',
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
        img: '/images/categories/motorcycles.png',
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
        img: '/images/categories/commercial.png',
      },
      {
        id: 'boats',
        key: 'subcategories.boats',
        img: '/images/categories/boats.png',
      },
      {
        id: 'parts',
        key: 'subcategories.parts',
        img: '/images/categories/parts.png',
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
        img: '/images/categories/rent.png',
      },
      {
        id: 'sale',
        key: 'subcategories.sale',
        img: '/images/categories/sale.png',
      },
      {
        id: 'commercial-property',
        key: 'subcategories.commercial-property',
        img: '/images/categories/commercial-property.png',
      },
      {
        id: 'land',
        key: 'subcategories.land',
        img: '/images/categories/land.png',
      },
    ],
  },

  {
    id: 'electronics',
    hasSafeDeal: true,
    key: 'categories.electronics',
    img: '/images/categories/electronics.png',
    subcategories: [
      {
        id: 'phones',
        key: 'subcategories.phones',
        img: '/images/categories/phones.png',
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
        img: '/images/categories/computers.png',
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
        img: '/images/categories/gaming.png',
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
        img: '/images/categories/tv-audio-photo.png',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
        img: '/images/categories/appliances.png',
      },
      {
        id: 'accessories-electronics',
        key: 'subcategories.accessories-electronics',
        img: '/images/categories/accessories-electronics.png',
      },
    ],
  },

  {
    id: 'fashion',
    hasSafeDeal: true,
    key: 'categories.fashion',
    img: '/images/categories/fashion.png',
    subcategories: [
      {
        id: 'men',
        key: 'subcategories.men',
        img: '/images/categories/men.png',
      },
      {
        id: 'women',
        key: 'subcategories.women',
        img: '/images/categories/women.png',
      },
      {
        id: 'shoes',
        key: 'subcategories.shoes',
        img: '/images/categories/shoes.png',
      },
      {
        id: 'bags',
        key: 'subcategories.bags',
        img: '/images/categories/bags.png',
      },
      {
        id: 'accessories-fashion',
        key: 'subcategories.accessories-fashion',
        img: '/images/categories/accessories-fashion.png',
      },
      {
        id: 'beauty-products',
        key: 'subcategories.beauty-products',
        img: '/images/categories/beauty-products.png',
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
        img: '/images/categories/vacancies.png',
      },
      {
        id: 'resumes',
        key: 'subcategories.resumes',
        img: '/images/categories/resumes.png',
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
        img: '/images/categories/construction.png',
      },
      {
        id: 'it-dev',
        key: 'subcategories.it-dev',
        img: '/images/categories/it-dev.png',
      },
      {
        id: 'education',
        key: 'subcategories.education',
        img: '/images/categories/education.png',
      },
      {
        id: 'beauty',
        key: 'subcategories.beauty',
        img: '/images/categories/beauty.png',
      },
      {
        id: 'other-services',
        key: 'subcategories.other-services',
        img: '/images/categories/other-services.png',
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
        img: '/images/categories/pets.png',
      },
      {
        id: 'other-animals',
        key: 'subcategories.other-animals',
        img: '/images/categories/other-animals.png',
      },
      {
        id: 'supplies',
        key: 'subcategories.supplies',
        img: '/images/categories/supplies.png',
      },
    ],
  },

  {
    id: 'hobby',
    hasSafeDeal: true,
    key: 'categories.hobby',
    img: '/images/categories/hobby.png',
    subcategories: [
      {
        id: 'sport',
        key: 'subcategories.sport',
        img: '/images/categories/sport.png',
      },
      {
        id: 'music',
        key: 'subcategories.music',
        img: '/images/categories/music.png',
      },
      {
        id: 'games',
        key: 'subcategories.games',
        img: '/images/categories/games.png',
      },
      {
        id: 'collectibles',
        key: 'subcategories.collectibles',
        img: '/images/categories/collectibles.png',
      },
      {
        id: 'other-hobby',
        key: 'subcategories.other-hobby',
        img: '/images/categories/other-hobby.png',
      },
    ],
  },

  {
    id: 'kids',
    hasSafeDeal: true,
    key: 'categories.kids',
    img: '/images/categories/kids.png',
    subcategories: [
      {
        id: 'clothes',
        key: 'subcategories.clothes',
        img: '/images/categories/clothes.png',
      },
      {
        id: 'toys',
        key: 'subcategories.toys',
        img: '/images/categories/toys.png',
      },
      {
        id: 'furniture',
        key: 'subcategories.furniture',
        img: '/images/categories/furniture.png',
      },
      {
        id: 'other-kids',
        key: 'subcategories.other-kids',
        img: '/images/categories/other-kids.png',
      },
    ],
  },

  {
    id: 'home',
    hasSafeDeal: true,
    key: 'categories.home',
    img: '/images/categories/home.png',
    subcategories: [
      {
        id: 'furniture',
        key: 'subcategories.furniture',
        img: '/images/categories/furniture.png',
      },
      {
        id: 'appliances',
        key: 'subcategories.appliances',
        img: '/images/categories/appliances.png',
      },
      {
        id: 'tools',
        key: 'subcategories.tools',
        img: '/images/categories/tools.png',
      },
      {
        id: 'decor',
        key: 'subcategories.decor',
        img: '/images/categories/decor.png',
      },
      {
        id: 'other-home',
        key: 'subcategories.other-home',
        img: '/images/categories/other-home.png',
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
