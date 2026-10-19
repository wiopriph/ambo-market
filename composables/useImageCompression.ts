import imageCompression from 'browser-image-compression';
import {
  canSkipCompression,
  PHOTO_MAX_DIMENSION,
  runSequential,
} from '~/utils/imageCompression';


export type CompressedImage = {
  base64: string;
  mimeType: string;
};

type Profile = 'photo' | 'preview' | 'avatar';

// WebP: тот же формат, что раньше делал сервер, ~25% легче JPEG.
// Если браузер не умеет кодировать webp (старый Safari), canvas молча
// отдаёт png - поэтому mimeType всегда берём из фактического результата.
const PROFILES: Record<Profile, { maxWidthOrHeight: number; maxSizeMB: number; initialQuality: number }> = {
  photo: { maxWidthOrHeight: PHOTO_MAX_DIMENSION, maxSizeMB: 1, initialQuality: 0.82 },
  preview: { maxWidthOrHeight: 360, maxSizeMB: 0.15, initialQuality: 0.75 },
  avatar: { maxWidthOrHeight: 360, maxSizeMB: 0.3, initialQuality: 0.8 },
};

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = () => resolve(reader.result as string);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

export function dataUrlToFile(dataUrl: string, name = 'image'): File {
  const [head, body] = dataUrl.split(',');
  const mime = head.match(/data:([^;]+)/)?.[1] ?? 'image/webp';
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], name, { type: mime });
}

async function getMaxDimension(file: File): Promise<number | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const max = Math.max(bitmap.width, bitmap.height);

    bitmap.close();

    return max;
  } catch {
    return null;
  }
}

export function useImageCompression() {
  const compressOne = async (file: File, profile: Profile): Promise<CompressedImage> => {
    let output: Blob = file;

    const skip = profile === 'photo' &&
      canSkipCompression(file.size, await getMaxDimension(file));

    if (!skip) {
      output = await imageCompression(file, {
        ...PROFILES[profile],
        useWebWorker: true,
        fileType: 'image/webp',
      });
    }

    return {
      base64: await blobToDataUrl(output),
      mimeType: output.type || file.type,
    };
  };

  const compressMany = (
    files: File[],
    profile: Profile,
    onProgress?: (processed: number, total: number) => void,
  ) => runSequential(files, file => compressOne(file, profile), onProgress);

  return { compressOne, compressMany };
}
