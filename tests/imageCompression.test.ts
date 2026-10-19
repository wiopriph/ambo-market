import { describe, expect, it } from 'vitest';
import { canSkipCompression, runSequential, SKIP_MAX_BYTES } from '../utils/imageCompression';


describe('canSkipCompression', () => {
  it('пропускает маленький файл с маленьким габаритом', () => {
    expect(canSkipCompression(100 * 1024, 1200)).toBe(true);
  });

  it('жмёт, если размер больше порога', () => {
    expect(canSkipCompression(SKIP_MAX_BYTES + 1, 1200)).toBe(false);
  });

  it('жмёт, если габарит больше целевого', () => {
    expect(canSkipCompression(100 * 1024, 4000)).toBe(false);
  });

  it('жмёт, если габарит не удалось прочитать', () => {
    expect(canSkipCompression(100 * 1024, null)).toBe(false);
  });
});

describe('runSequential', () => {
  it('обрабатывает строго по одному', async () => {
    let inFlight = 0;
    let maxInFlight = 0;

    await runSequential([1, 2, 3], async (n) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise(resolve => setTimeout(resolve, 5));
      inFlight -= 1;

      return n * 2;
    });

    expect(maxInFlight).toBe(1);
  });

  it('ошибка одного файла не роняет остальные', async () => {
    const { done, failed } = await runSequential([1, 2, 3], async (n) => {
      if (n === 2) throw new Error('boom');

      return n;
    });

    expect(done).toEqual([1, 3]);
    expect(failed).toHaveLength(1);
    expect(failed[0].item).toBe(2);
  });

  it('прогресс идёт по каждому файлу, включая упавшие', async () => {
    const progress: string[] = [];

    await runSequential(
      ['a', 'b'],
      async (item) => {
        if (item === 'a') throw new Error('bad');

        return item;
      },
      (processed, total) => progress.push(`${processed}/${total}`),
    );

    expect(progress).toEqual(['1/2', '2/2']);
  });
});
