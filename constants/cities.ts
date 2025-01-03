interface City {
  id: string;
  name: string;
  lat: number | null;
  lon: number | null;
}

export const CITIES: City[] = [
  {
    id: 'soyo',
    name: 'Soyo',
    lat: -6.1333775,
    lon: 12.3717548,
  },
  {
    id: 'benguela',
    name: 'Benguela',
    lat: -12.5790048,
    lon: 13.4037117,
  },
  {
    id: 'cabinda',
    name: 'Cabinda',
    lat: -5.5576435,
    lon: 12.1919468,
  },
  {
    id: 'luanda',
    name: 'Luanda',
    lat: -8.8272699,
    lon: 13.2439512,
  },
  {
    id: 'lubango',
    name: 'Lubango',
    lat: -14.9195617,
    lon: 13.4897509,
  },
  {
    id: 'namibe',
    name: 'Moçâmedes',
    lat: -15.195064,
    lon: 12.1458085,
  },
  {
    id: 'sumbe',
    name: 'Sumbe',
    lat: -11.2019365,
    lon: 13.8396845,
  },
  {
    id: 'all',
    name: '',
    lat: null,
    lon: null,
  },
];

const cityMapById = new Map<string, City>(CITIES.map(city => [city.id, city]));

const cityMapByName = new Map<string, City>(CITIES.map(city => [city.name, city]));


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
  const cityInfo = cityMapByName.get(cityName);

  return cityInfo?.id || 'all';
}
