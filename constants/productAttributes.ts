export type AttributeFieldType = 'select' | 'number' | 'text' | 'boolean';

export interface AttributeFieldOption {
  value: string;
  label: string;
}

export interface AttributeField {
  key: string;
  label: string;
  type: AttributeFieldType;
  options?: AttributeFieldOption[];
  unit?: string;
  required?: boolean;
  placeholder?: string;
}

const toOptions = (values: string[]): AttributeFieldOption[] =>
  values.map(value => ({ value, label: value }));

const CONDITION_2: AttributeFieldOption[] = [
  { value: 'new', label: 'Novo' },
  { value: 'used', label: 'Usado' },
];

const CONDITION_3: AttributeFieldOption[] = [
  { value: 'new', label: 'Novo' },
  { value: 'used', label: 'Usado' },
  { value: 'refurbished', label: 'Recondicionado' },
];

const conditionField = (options: AttributeFieldOption[] = CONDITION_2, required = false): AttributeField => ({
  key: 'condition',
  label: 'Estado',
  type: 'select',
  options,
  required,
});

const CLOTHING_SIZES = toOptions(['PP', 'P', 'M', 'G', 'GG', 'XG']);
const SHOE_SIZES = toOptions(['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']);
const KIDS_AGE_RANGES = toOptions(['0-1 ano', '1-3 anos', '4-6 anos', '7-9 anos', '10-12 anos', '13+ anos']);

/**
 * Ключ карты — `${categoryId}/${subcategoryId}`.
 * subcategoryId по себе НЕ уникален между категориями (ex: "furniture" есть
 * и в kids, и в home), поэтому используем составной ключ, а не просто id.
 *
 * Чтобы добавить новую категорию атрибутов — допиши запись сюда,
 * форма и карточка товара подхватят её автоматически.
 */
export const PRODUCT_ATTRIBUTES: Record<string, AttributeField[]> = {
  // Transporte
  'vehicles/cars': [
    { key: 'year', label: 'Ano', type: 'number', placeholder: 'Ex: 2018' },
    { key: 'mileage', label: 'Quilometragem', type: 'number', unit: 'km', placeholder: 'Ex: 55000' },
    {
      key: 'fuel',
      label: 'Combustível',
      type: 'select',
      options: [
        { value: 'gasoline', label: 'Gasolina' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'Eléctrico' },
        { value: 'hybrid', label: 'Híbrido' },
      ],
    },
    {
      key: 'transmission',
      label: 'Caixa',
      type: 'select',
      options: [
        { value: 'manual', label: 'Manual' },
        { value: 'automatic', label: 'Automática' },
      ],
    },
    conditionField(CONDITION_2),
  ],

  'vehicles/motorcycles': [
    { key: 'year', label: 'Ano', type: 'number', placeholder: 'Ex: 2020' },
    { key: 'mileage', label: 'Quilometragem', type: 'number', unit: 'km', placeholder: 'Ex: 12000' },
    { key: 'engineSize', label: 'Cilindrada', type: 'number', unit: 'cc', placeholder: 'Ex: 150' },
    conditionField(CONDITION_2),
  ],

  'vehicles/commercial': [
    { key: 'year', label: 'Ano', type: 'number', placeholder: 'Ex: 2015' },
    { key: 'mileage', label: 'Quilometragem', type: 'number', unit: 'km' },
    {
      key: 'fuel',
      label: 'Combustível',
      type: 'select',
      options: [
        { value: 'gasoline', label: 'Gasolina' },
        { value: 'diesel', label: 'Diesel' },
      ],
    },
    {
      key: 'loadCapacity',
      label: 'Capacidade de Carga',
      type: 'number',
      unit: 'ton',
    },
    conditionField(),
  ],

  'vehicles/boats': [
    { key: 'year', label: 'Ano', type: 'number' },
    { key: 'length', label: 'Comprimento', type: 'number', unit: 'm' },
    {
      key: 'engineType',
      label: 'Motor',
      type: 'select',
      options: [
        { value: 'gasoline', label: 'A Gasolina' },
        { value: 'diesel', label: 'A Diesel' },
        { value: 'none', label: 'Sem Motor' },
      ],
    },
    conditionField(),
  ],

  'vehicles/parts': [
    { key: 'partType', label: 'Tipo de Peça', type: 'text', placeholder: 'Ex: Pneu, Bateria, Farol' },
    { key: 'compatibility', label: 'Compatível com', type: 'text', placeholder: 'Ex: Toyota Hilux 2015-2020' },
    conditionField(CONDITION_3),
  ],

  // Imóveis
  'real-estate/rent': [
    { key: 'area', label: 'Área', type: 'number', unit: 'm²', placeholder: 'Ex: 80' },
    { key: 'rooms', label: 'Quartos (T)', type: 'select', options: toOptions(['T0', 'T1', 'T2', 'T3', 'T4', 'T5+']) },
    { key: 'bathrooms', label: 'Casas de Banho', type: 'number', placeholder: 'Ex: 2' },
    { key: 'furnished', label: 'Mobilado', type: 'boolean' },
  ],

  'real-estate/sale': [
    { key: 'area', label: 'Área', type: 'number', unit: 'm²', placeholder: 'Ex: 120' },
    { key: 'rooms', label: 'Quartos (T)', type: 'select', options: toOptions(['T0', 'T1', 'T2', 'T3', 'T4', 'T5+']) },
    { key: 'bathrooms', label: 'Casas de Banho', type: 'number', placeholder: 'Ex: 2' },
    {
      key: 'condition',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'new', label: 'Novo' },
        { value: 'used', label: 'Usado' },
        { value: 'under-construction', label: 'Em construção' },
      ],
    },
  ],

  'real-estate/commercial-property': [
    { key: 'area', label: 'Área', type: 'number', unit: 'm²' },
    {
      key: 'propertyType',
      label: 'Tipo de Espaço',
      type: 'select',
      options: [
        { value: 'store', label: 'Loja' },
        { value: 'office', label: 'Escritório' },
        { value: 'warehouse', label: 'Armazém' },
        { value: 'restaurant', label: 'Restaurante' },
        { value: 'other', label: 'Outro' },
      ],
    },
  ],

  'real-estate/land': [
    { key: 'area', label: 'Área', type: 'number', unit: 'm²' },
    {
      key: 'landType',
      label: 'Tipo de Terreno',
      type: 'select',
      options: [
        { value: 'residential', label: 'Residencial' },
        { value: 'commercial', label: 'Comercial' },
        { value: 'agricultural', label: 'Agrícola' },
      ],
    },
    { key: 'documented', label: 'Documentação Regularizada', type: 'boolean' },
  ],

  // Eletrônicos
  'electronics/phones': [
    { key: 'storage', label: 'Armazenamento', type: 'select', options: toOptions(['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']) },
    { key: 'ram', label: 'Memória RAM', type: 'select', options: toOptions(['2GB', '4GB', '6GB', '8GB', '12GB', '16GB']) },
    conditionField(CONDITION_3),
  ],

  'electronics/computers': [
    { key: 'processor', label: 'Processador', type: 'text', placeholder: 'Ex: Intel i5 11ª geração' },
    { key: 'ram', label: 'Memória RAM', type: 'select', options: toOptions(['4GB', '8GB', '16GB', '32GB', '64GB']) },
    {
      key: 'storage',
      label: 'Armazenamento',
      type: 'select',
      options: toOptions(['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD', '2TB HDD']),
    },
    conditionField(CONDITION_3),
  ],

  'electronics/gaming': [
    {
      key: 'platform',
      label: 'Plataforma',
      type: 'select',
      options: [
        { value: 'playstation', label: 'PlayStation' },
        { value: 'xbox', label: 'Xbox' },
        { value: 'nintendo', label: 'Nintendo' },
        { value: 'pc', label: 'PC' },
      ],
    },
    conditionField(CONDITION_3),
  ],

  'electronics/tv-audio-photo': [
    {
      key: 'deviceType',
      label: 'Tipo de Aparelho',
      type: 'select',
      options: [
        { value: 'tv', label: 'TV' },
        { value: 'audio', label: 'Som' },
        { value: 'camera', label: 'Câmara' },
        { value: 'other', label: 'Outro' },
      ],
    },
    { key: 'screenSize', label: 'Tamanho do Ecrã', type: 'number', unit: 'polegadas' },
    conditionField(CONDITION_3),
  ],

  'electronics/appliances': [
    {
      key: 'applianceType',
      label: 'Tipo de Electrodoméstico',
      type: 'select',
      options: [
        { value: 'fridge', label: 'Frigorífico' },
        { value: 'washer', label: 'Máquina de Lavar' },
        { value: 'stove', label: 'Fogão' },
        { value: 'microwave', label: 'Micro-ondas' },
        { value: 'ac', label: 'Ar Condicionado' },
        { value: 'other', label: 'Outro' },
      ],
    },
    conditionField(CONDITION_3),
  ],

  'electronics/accessories-electronics': [
    { key: 'accessoryType', label: 'Tipo de Acessório', type: 'text', placeholder: 'Ex: Carregador, Capa, Auscultadores' },
    conditionField(CONDITION_3),
  ],

  // Moda
  'fashion/men': [
    { key: 'size', label: 'Tamanho', type: 'select', options: CLOTHING_SIZES },
    conditionField(),
  ],

  'fashion/women': [
    { key: 'size', label: 'Tamanho', type: 'select', options: CLOTHING_SIZES },
    conditionField(),
  ],

  'fashion/shoes': [
    { key: 'size', label: 'Número', type: 'select', options: SHOE_SIZES },
    conditionField(),
  ],

  'fashion/bags': [
    { key: 'material', label: 'Material', type: 'text', placeholder: 'Ex: Couro, Tecido' },
    conditionField(),
  ],

  'fashion/accessories-fashion': [
    { key: 'accessoryType', label: 'Tipo de Acessório', type: 'text', placeholder: 'Ex: Relógio, Óculos, Bijutaria' },
    conditionField(),
  ],

  'fashion/beauty-products': [
    { key: 'brand', label: 'Marca', type: 'text' },
    { key: 'sealed', label: 'Lacrado', type: 'boolean' },
  ],

  // Emprego
  'jobs/vacancies': [
    {
      key: 'employmentType',
      label: 'Tipo de Contrato',
      type: 'select',
      options: [
        { value: 'full-time', label: 'Tempo Integral' },
        { value: 'part-time', label: 'Meio Período' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'internship', label: 'Estágio' },
      ],
    },
    {
      key: 'experienceLevel',
      label: 'Nível de Experiência',
      type: 'select',
      options: [
        { value: 'junior', label: 'Júnior' },
        { value: 'mid', label: 'Pleno' },
        { value: 'senior', label: 'Sénior' },
      ],
    },
    { key: 'salaryNegotiable', label: 'Salário Negociável', type: 'boolean' },
  ],

  'jobs/resumes': [
    { key: 'desiredPosition', label: 'Cargo Pretendido', type: 'text' },
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  // Serviços
  'services/construction': [
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  'services/it-dev': [
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  'services/education': [
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  'services/beauty': [
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  'services/other-services': [
    { key: 'experienceYears', label: 'Anos de Experiência', type: 'number' },
    {
      key: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      options: [
        { value: 'immediate', label: 'Imediata' },
        { value: 'negotiable', label: 'A Combinar' },
      ],
    },
  ],

  // Animais
  'animals/pets': [
    {
      key: 'species',
      label: 'Espécie',
      type: 'select',
      options: [
        { value: 'dog', label: 'Cão' },
        { value: 'cat', label: 'Gato' },
        { value: 'other', label: 'Outro' },
      ],
    },
    { key: 'age', label: 'Idade', type: 'text', placeholder: 'Ex: 6 meses' },
    { key: 'vaccinated', label: 'Vacinado', type: 'boolean' },
  ],

  'animals/other-animals': [
    { key: 'species', label: 'Espécie', type: 'text', placeholder: 'Ex: Galinha, Cabra, Vaca' },
    { key: 'quantity', label: 'Quantidade', type: 'number' },
  ],

  'animals/supplies': [
    { key: 'supplyType', label: 'Tipo de Produto', type: 'text', placeholder: 'Ex: Ração, Coleira, Gaiola' },
    conditionField(),
  ],

  // Passatempos
  'hobby/sport': [
    { key: 'itemType', label: 'Tipo de Item', type: 'text', placeholder: 'Ex: Bicicleta, Bola, Equipamento de Ginásio' },
    conditionField(),
  ],

  'hobby/music': [
    { key: 'instrumentType', label: 'Instrumento', type: 'text', placeholder: 'Ex: Guitarra, Teclado, Bateria' },
    conditionField(),
  ],

  'hobby/games': [
    {
      key: 'itemType',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'book', label: 'Livro' },
        { value: 'board-game', label: 'Jogo de Tabuleiro' },
        { value: 'video-game', label: 'Videojogo' },
      ],
    },
    conditionField(),
  ],

  'hobby/collectibles': [
    { key: 'itemCategory', label: 'Categoria', type: 'text', placeholder: 'Ex: Moedas, Selos, Antiguidades' },
    conditionField(),
  ],

  'hobby/other-hobby': [
    conditionField(),
  ],

  // Para Crianças
  'kids/clothes': [
    { key: 'ageRange', label: 'Faixa Etária', type: 'select', options: KIDS_AGE_RANGES },
    { key: 'size', label: 'Tamanho', type: 'text', placeholder: 'Ex: 2 anos, 4 anos' },
    conditionField(),
  ],

  'kids/toys': [
    { key: 'ageRange', label: 'Faixa Etária', type: 'select', options: KIDS_AGE_RANGES },
    conditionField(),
  ],

  'kids/furniture': [
    { key: 'itemType', label: 'Tipo de Móvel', type: 'text', placeholder: 'Ex: Berço, Cadeira Alta' },
    conditionField(),
  ],

  'kids/other-kids': [
    conditionField(),
  ],

  // Casa
  'home/furniture': [
    { key: 'itemType', label: 'Tipo de Móvel', type: 'text', placeholder: 'Ex: Sofá, Cama, Roupeiro' },
    { key: 'material', label: 'Material', type: 'text', placeholder: 'Ex: Madeira, Metal' },
    conditionField(),
  ],

  'home/appliances': [
    {
      key: 'applianceType',
      label: 'Tipo de Electrodoméstico',
      type: 'select',
      options: [
        { value: 'fridge', label: 'Frigorífico' },
        { value: 'washer', label: 'Máquina de Lavar' },
        { value: 'stove', label: 'Fogão' },
        { value: 'microwave', label: 'Micro-ondas' },
        { value: 'ac', label: 'Ar Condicionado' },
        { value: 'other', label: 'Outro' },
      ],
    },
    conditionField(CONDITION_3),
  ],

  'home/tools': [
    { key: 'toolType', label: 'Tipo de Ferramenta', type: 'text', placeholder: 'Ex: Furadeira, Serra' },
    conditionField(),
  ],

  'home/decor': [
    { key: 'itemType', label: 'Tipo de Item', type: 'text', placeholder: 'Ex: Quadro, Tapete, Candeeiro' },
    conditionField(),
  ],

  'home/other-home': [
    conditionField(),
  ],
};

export function getProductAttributeFields(categoryId?: string | null, subcategoryId?: string | null): AttributeField[] {
  if (categoryId && subcategoryId) {
    const composite = PRODUCT_ATTRIBUTES[`${categoryId}/${subcategoryId}`];

    if (composite) {
      return composite;
    }
  }

  if (categoryId && PRODUCT_ATTRIBUTES[categoryId]) {
    return PRODUCT_ATTRIBUTES[categoryId];
  }

  return [];
}

export function formatAttributeValue(field: AttributeField, rawValue: unknown): string {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return '';
  }

  if (field.type === 'select') {
    return field.options?.find(option => option.value === rawValue)?.label ?? String(rawValue);
  }

  if (field.type === 'boolean') {
    return rawValue ? 'Sim' : 'Não';
  }

  return field.unit ? `${rawValue} ${field.unit}` : String(rawValue);
}
