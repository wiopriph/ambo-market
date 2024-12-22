import type { Filters } from '~/composables/usePosts/types';

/**
 * Сравнивает два объекта и возвращает объект, содержащий отличающиеся значения из первого объекта.
 *
 * @param baseObj - Первый объект для сравнения.
 * @param compareObj - Второй объект для сравнения.
 * @returns - Объект, содержащий только отличающиеся значения из первого объекта.
 */
export default function<T extends Partial<Filters>>(baseObj: T, compareObj: T): Partial<T> {
  const differences: Partial<T> = {};

  for (const key in baseObj) {
    if (baseObj[key] !== compareObj[key]) {
      differences[key] = baseObj[key];
    }
  }

  return differences;
}
