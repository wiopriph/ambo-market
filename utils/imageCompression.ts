/**
 * Чистая логика клиентского сжатия фото: решения и последовательный
 * прогон. Сам кодек (browser-image-compression) инжектится снаружи -
 * это тестируется юнитами без браузера.
 */

export const SKIP_MAX_BYTES = 300 * 1024;
export const PHOTO_MAX_DIMENSION = 1600;

/**
 * Файл можно не пережимать, только когда он и так мал И вписывается
 * в целевой габарит. null-габарит = не смогли декодировать размер,
 * значит сжимаем (там же выяснится, читается ли файл вообще).
 */
export function canSkipCompression(sizeBytes: number, maxDimension: number | null): boolean {
  return sizeBytes <= SKIP_MAX_BYTES &&
    maxDimension !== null &&
    maxDimension <= PHOTO_MAX_DIMENSION;
}

export type SequentialResult<T, R> = {
  done: R[];
  failed: { item: T; error: unknown }[];
};

/**
 * Последовательно (конкурентность 1 - щадим память дешёвых телефонов),
 * ошибка одного элемента не роняет остальные.
 */
export async function runSequential<T, R>(
  items: T[],
  process: (item: T, index: number) => Promise<R>,
  onProgress?: (processed: number, total: number) => void,
): Promise<SequentialResult<T, R>> {
  const done: R[] = [];
  const failed: { item: T; error: unknown }[] = [];

  for (const [index, item] of items.entries()) {
    try {
      done.push(await process(item, index));
    } catch (error) {
      failed.push({ item, error });
    }

    onProgress?.(index + 1, items.length);
  }

  return { done, failed };
}
