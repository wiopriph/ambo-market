interface Brand {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  icon: string;
  brands?: Brand[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'vehicles',
    name: 'Transporte',
    icon: 'i-lucide-car',
    subcategories: [
      {
        id: 'cars',
        name: 'Carros',
        icon: 'i-lucide-car',
        brands: [
          { id: 'other', name: 'Outro' },
          { id: 'toyota', name: 'Toyota' },
          { id: 'suzuki', name: 'Suzuki' },
          { id: 'hyundai', name: 'Hyundai' },
          { id: 'kia', name: 'Kia' },
          { id: 'mitsubishi', name: 'Mitsubishi' },
          { id: 'chevrolet', name: 'Chevrolet' },
          { id: 'nissan', name: 'Nissan' },
          { id: 'renault', name: 'Renault' },
          { id: 'ford', name: 'Ford' },
          { id: 'mercedes', name: 'Mercedes-Benz' },
          { id: 'volkswagen', name: 'Volkswagen' },
          { id: 'bmw', name: 'BMW' },
          { id: 'jetour', name: 'Jetour' },
        ],
      },
      {
        id: 'motorcycles',
        name: 'Motos e Scooters',
        icon: 'i-lucide-bike',
        brands: [
          { id: 'other', name: 'Outro' },
          { id: 'honda', name: 'Honda' },
          { id: 'yamaha', name: 'Yamaha' },
          { id: 'suzuki', name: 'Suzuki' },
          { id: 'kawasaki', name: 'Kawasaki' },
          { id: 'vespa', name: 'Vespa' },
          { id: 'ducati', name: 'Ducati' },
          { id: 'bmw-motorrad', name: 'BMW Motorrad' },
          { id: 'harley-davidson', name: 'Harley Davidson' },
          { id: 'aprilia', name: 'Aprilia' },
        ],
      },
      { id: 'commercial', name: 'Veículos Comerciais', icon: 'i-lucide-truck' },
      { id: 'boats', name: 'Barcos', icon: 'i-lucide-ship' },
      { id: 'parts', name: 'Peças e Acessórios', icon: 'i-lucide-cog' },
    ],
  },

  {
    id: 'real-estate',
    name: 'Imóveis',
    icon: 'i-lucide-house',
    subcategories: [
      { id: 'rent', name: 'Aluguel', icon: 'i-lucide-key-round' },
      { id: 'sale', name: 'Venda', icon: 'i-lucide-badge-dollar-sign' },
      { id: 'commercial-property', name: 'Imóveis Comerciais', icon: 'i-lucide-building-2' },
      { id: 'land', name: 'Terreno', icon: 'i-lucide-map' },
    ],
  },

  {
    id: 'electronics',
    name: 'Eletrônicos',
    icon: 'i-lucide-smartphone',
    subcategories: [
      {
        id: 'phones',
        name: 'Telemóveis',
        icon: 'i-lucide-smartphone',
        brands: [
          { id: 'other', name: 'Outro' },
          { id: 'apple', name: 'Apple' },
          { id: 'samsung', name: 'Samsung' },
          { id: 'itel', name: 'iTel' },
          { id: 'tecno', name: 'Tecno' },
          { id: 'xiaomi', name: 'Xiaomi' },
          { id: 'huawei', name: 'Huawei' },
          { id: 'oppo', name: 'Oppo' },
        ],
      },
      {
        id: 'computers',
        name: 'Computadores e Portáteis',
        icon: 'i-lucide-laptop',
        brands: [
          { id: 'other', name: 'Outro' },
          { id: 'hp', name: 'HP' },
          { id: 'dell', name: 'Dell' },
          { id: 'asus', name: 'Asus' },
          { id: 'lenovo', name: 'Lenovo' },
          { id: 'apple', name: 'Apple' },
          { id: 'acer', name: 'Acer' },
          { id: 'msi', name: 'MSI' },
          { id: 'huawei', name: 'Huawei' },
        ],
      },
      {
        id: 'gaming',
        name: 'Jogos',
        icon: 'i-lucide-gamepad-2',
        brands: [
          { id: 'sony', name: 'Sony' },
          { id: 'microsoft', name: 'Microsoft' },
          { id: 'nintendo', name: 'Nintendo' },
          { id: 'valve', name: 'Valve' },
          { id: 'other', name: 'Outro' },
        ],
      },
      { id: 'tv-audio-photo', name: 'TV, Áudio e Foto', icon: 'i-lucide-tv' },
      { id: 'appliances', name: 'Eletrodomésticos', icon: 'i-lucide-washing-machine' },
      { id: 'accessories-electronics', name: 'Acessórios', icon: 'i-lucide-cable' },
    ],
  },

  {
    id: 'fashion',
    name: 'Moda',
    icon: 'i-lucide-shirt',
    subcategories: [
      { id: 'men', name: 'Moda Masculina', icon: 'i-lucide-user-round' },
      { id: 'women', name: 'Moda Feminina', icon: 'i-lucide-users-round' },
      { id: 'shoes', name: 'Calçados', icon: 'i-lucide-footprints' },
      { id: 'bags', name: 'Bolsas', icon: 'i-lucide-shopping-bag' },
      { id: 'accessories-fashion', name: 'Acessórios', icon: 'i-lucide-watch' },
      { id: 'beauty-products', name: 'Produtos de Beleza', icon: 'i-lucide-sparkles' },
    ],
  },

  {
    id: 'jobs',
    name: 'Emprego',
    icon: 'i-lucide-briefcase-business',
    subcategories: [
      { id: 'vacancies', name: 'Vagas', icon: 'i-lucide-clipboard-list' },
      { id: 'resumes', name: 'Currículos', icon: 'i-lucide-file-user' },
    ],
  },

  {
    id: 'services',
    name: 'Serviços',
    icon: 'i-lucide-wrench',
    subcategories: [
      { id: 'construction', name: 'Construção e Reforma', icon: 'i-lucide-hard-hat' },
      { id: 'it-dev', name: 'TI e Desenvolvimento', icon: 'i-lucide-code' },
      { id: 'education', name: 'Educação', icon: 'i-lucide-graduation-cap' },
      { id: 'beauty', name: 'Beleza e Saúde', icon: 'i-lucide-scissors' },
      { id: 'other-services', name: 'Outros Serviços', icon: 'i-lucide-ellipsis' },
    ],
  },

  {
    id: 'animals',
    name: 'Animais',
    icon: 'i-lucide-paw-print',
    subcategories: [
      { id: 'pets', name: 'Cães e Gatos', icon: 'i-lucide-paw-print' },
      { id: 'other-animals', name: 'Outros Animais', icon: 'i-lucide-bone' },
      { id: 'supplies', name: 'Rações e Acessórios', icon: 'i-lucide-package' },
    ],
  },

  {
    id: 'hobby',
    name: 'Passatempos',
    icon: 'i-lucide-palette',
    subcategories: [
      { id: 'sport', name: 'Esporte e Lazer', icon: 'i-lucide-dumbbell' },
      { id: 'music', name: 'Música e Instrumentos', icon: 'i-lucide-music' },
      { id: 'games', name: 'Livros e Jogos', icon: 'i-lucide-dice-5' },
      { id: 'collectibles', name: 'Colecionáveis e Antiguidades', icon: 'i-lucide-trophy' },
      { id: 'other-hobby', name: 'Outros Passatempos', icon: 'i-lucide-puzzle' },
    ],
  },

  {
    id: 'kids',
    name: 'Para Crianças',
    icon: 'i-lucide-baby',
    subcategories: [
      { id: 'clothes', name: 'Roupas Infantis', icon: 'i-lucide-shirt' },
      { id: 'toys', name: 'Brinquedos', icon: 'i-lucide-blocks' },
      { id: 'furniture', name: 'Móveis', icon: 'i-lucide-armchair' },
      { id: 'other-kids', name: 'Outros Itens Infantis', icon: 'i-lucide-baby' },
    ],
  },

  {
    id: 'home',
    name: 'Casa',
    icon: 'i-lucide-house',
    subcategories: [
      { id: 'furniture', name: 'Móveis', icon: 'i-lucide-sofa' },
      { id: 'appliances', name: 'Eletrodomésticos', icon: 'i-lucide-washing-machine' },
      { id: 'tools', name: 'Ferramentas', icon: 'i-lucide-hammer' },
      { id: 'decor', name: 'Decoração', icon: 'i-lucide-lamp' },
      { id: 'other-home', name: 'Outros para Casa', icon: 'i-lucide-boxes' },
    ],
  },
];


const categoryMap = new Map<string, Category>(CATEGORIES.map(category => [category.id, category]));

export const TYPES: string[] = [...categoryMap.keys()];

export function getCategoryById(categoryId: string): Category | undefined {
  return categoryMap.get(categoryId);
}

export function getCategoryName(categoryId: string): string {
  return getCategoryById(categoryId)?.name ?? '';
}

export function getSubcategoryName(categoryId: string, subcategoryId: string): string {
  const cat = getCategoryById(categoryId);

  return cat?.subcategories?.find(s => s.id === subcategoryId)?.name ?? '';
}

export function getBrandName(categoryId: string, subcategoryId: string, brandId: string): string {
  const cat = getCategoryById(categoryId);
  const sub = cat?.subcategories?.find(s => s.id === subcategoryId);

  return sub?.brands?.find(b => b.id === brandId)?.name ?? '';
}
