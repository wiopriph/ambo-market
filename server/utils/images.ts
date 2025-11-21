import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<{ data: any; error: any }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

export async function processImageBuffer(
  buffer: Buffer,
  opts: { width?: number; height?: number } = {},
) {
  const { width = 1920, height = 1080 } = opts;

  try {
    return await sharp(buffer)
      .resize({
        width,
        height,
        fit: 'inside',
      })
      .rotate()
      .toBuffer();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing image:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing image',
    });
  }
}

/**
 * Загрузить фотку поста в бакет и вернуть public URL
 * path: post/<postId>/<uuid>.<ext>
 */
export async function uploadPostImage(
  client: SupabaseLikeClient,
  image: ImageInput,
  postId: string,
  opts?: { small?: boolean; bucketName?: string },
): Promise<string> {
  const bucketName = opts?.bucketName ?? 'media';

  const ext = image.mimeType.split('/')[1] || 'jpg';
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = `post/${postId}/${fileName}`;

  const base64 = image.base64.replace(/^data:image\/[^;]+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  const processed = await processImageBuffer(buffer, {
    width: opts?.small ? 360 : 1920,
    height: opts?.small ? 360 : 1080,
  });

  const { error: uploadError } = await client.storage
    .from(bucketName)
    .upload(filePath, processed, {
      contentType: image.mimeType,
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    // eslint-disable-next-line no-console
    console.error('Upload error', uploadError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image',
    });
  }

  const { data } = client.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
}
