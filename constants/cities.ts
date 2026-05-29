export interface City {
  id: string;
  name: string;
}

export const CITIES: City[] = [
  {
    id: 'all',
    name: '',
  },
  {
    id: 'luanda',
    name: 'Luanda',
  },
  {
    id: 'benguela',
    name: 'Benguela',
  },
  {
    id: 'huambo',
    name: 'Huambo',
  },
  {
    id: 'lobito',
    name: 'Lobito',
  },
  {
    id: 'lubango',
    name: 'Lubango',
  },
  {
    id: 'malanje',
    name: 'Malanje',
  },
  {
    id: 'cabinda',
    name: 'Cabinda',
  },
  {
    id: 'namibe',
    name: 'Namibe',
  },
  {
    id: 'soyo',
    name: 'Soyo',
  },
  {
    id: 'kuito',
    name: 'Kuito',
  },
];

const cityMapById = new Map<string, City>(CITIES.map(city => [city.id, city]));

const cityMapByName = new Map<string, City>(CITIES.map(city => [city.name.toLowerCase(), city]));


export const CITIES_IDS: string[] = CITIES.map(({ id }) => id);

/**
 * Поиск города по cityId
 * @param cityId - id города
 * @returns {City | undefined} Возвращает объект города или undefined, если не найден.
 */
export function getCityById(cityId: string): City | undefined {
  return cityMapById.get(cityId);
}

/**
 * Получение id по имени города
 * @param cityName - имя города
 * @returns {string} Возвращает id города или 'all', если город не найден.
 */
export function getCityIdByName(cityName: string): string {
  const cityInfo = cityMapByName.get(cityName && cityName.toLowerCase());

  return cityInfo?.id ?? 'all';
}

export function getCityByName(cityName: string): City | undefined {
  return cityMapByName.get(cityName && cityName.toLowerCase());
}
