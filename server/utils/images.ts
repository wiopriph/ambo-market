import { randomUUID } from 'node:crypto';
import { createError } from 'h3';


export type ImageInput = {
  base64: string;
  mimeType: string;
};

type SupabaseLikeClient = {
  storage: {
    from(bucket: string): {
      upload: (
        path: string,
        body: Buffer,
        options: { contentType: string; cacheControl?: string; upsert?: boolean },
      ) => Promise<{ data: any; error: any }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

// сжатие и ресайз делает клиент (useImageCompression) - сервер только
// валидирует и кладёт в сторадж; sharp убран ради Cloudflare Workers
const ALLOWED_TYPES: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function decodeImage(image: ImageInput): { buffer: Buffer; contentType: string; ext: string } {
  const contentType = (image?.mimeType ?? '').toLowerCase();
  const ext = ALLOWED_TYPES[contentType];

  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Formato de imagem não suportado. Use JPEG, PNG ou WebP.',
    });
  }

  const base64 = (image.base64 ?? '').replace(/^data:image\/[^;]+;base64,/, '');

  // длина base64 ~ 4/3 от байтов: дешёвая отсечка до декодирования
  if (!base64 || base64.length > MAX_IMAGE_BYTES * (4 / 3) + 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Imagem demasiado grande (máx. 2 MB).',
    });
  }

  const buffer = Buffer.from(base64, 'base64');

  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Imagem demasiado grande (máx. 2 MB).',
    });
  }

  return { buffer, contentType, ext };
}

async function uploadImage(
  client: SupabaseLikeClient,
  image: ImageInput,
  filePathBase: string,
  bucketName: string,
  upsert: boolean,
): Promise<string> {
  const { buffer, contentType, ext } = decodeImage(image);
  const filePath = `${filePathBase}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await client.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType,
      cacheControl: '31536000',
      upsert,
    });

  if (uploadError) {
    console.error('Upload error', uploadError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image',
    });
  }

  const { data } = client.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Сохранить фотку поста в бакет и вернуть public URL
 * path: post/<postId>/<uuid>.<ext>
 */
export function uploadPostImage(
  client: SupabaseLikeClient,
  image: ImageInput,
  postId: string,
  opts?: { bucketName?: string },
): Promise<string> {
  return uploadImage(client, image, `post/${postId}`, opts?.bucketName ?? 'media', false);
}

/**
 * Сохранить аватар пользователя в бакет и вернуть public URL
 * path: user/<userId>/<uuid>.<ext>
 */
export function uploadProfileImage(
  client: SupabaseLikeClient,
  image: ImageInput,
  userId: string,
  opts?: { bucketName?: string },
): Promise<string> {
  return uploadImage(client, image, `user/${userId}`, opts?.bucketName ?? 'media', true);
}
