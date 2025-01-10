export const DISTANCE = [
  { value: '1000', label: '1 km' },
  { value: '5000', label: '5 km' },
  { value: '10000', label: '10 km' },
  { value: '25000', label: '25 km' },
  { value: '50000', label: '50 km' },
  { value: '', label: '> 50 km' },
];

const distanceMap = new Map<string, string>(
  DISTANCE.map(({ value, label }) => [value, label]),
);

/**
 * Функция для получения метки расстояния по его значению.
 *
 * @param radius - Значение расстояния.
 * @returns Метка, соответствующая переданному значению расстояния или пустая строка, если значение не найдено.
 */
export function getLabelByRadius(radius: string): string {
  return distanceMap.get(radius) || '';
}
