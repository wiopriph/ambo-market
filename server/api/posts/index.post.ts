import { randomUUID } from 'node:crypto';
import { createError, defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { type ImageInput, uploadPostImage } from '~~/server/utils/images';
import { getCityById } from '~/constants/cities';
import { getProductAttributeFields } from '~/constants/productAttributes';


type LocationInput = {
  cityId?: string;
  cityName?: string;
};

// приводим значения атрибутов к типам из схемы: числовые фильтры (gte/lte по jsonb)
// работают только когда число хранится числом, а не строкой "2018"
function normalizeAttributes(
  attributes: Record<string, unknown> | undefined,
  categoryId: string,
  subcategoryId?: string,
): Record<string, unknown> | null {
  if (!attributes || typeof attributes !== 'object') return null;

  const fields = getProductAttributeFields(categoryId, subcategoryId);
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = attributes[field.key];

    if (value === undefined || value === null || value === '') continue;

    if (field.type === 'number') {
      const num = Number(value);

      if (!Number.isNaN(num)) result[field.key] = num;

      continue;
    }

    if (field.type === 'boolean') {
      result[field.key] = value === true || value === 'true';

      continue;
    }

    // select: принимаем только значения из схемы
    if (field.type === 'select') {
      const isAllowed = (field.options ?? []).some(option => option.value === value);

      if (isAllowed) result[field.key] = value;

      continue;
    }

    result[field.key] = String(value).slice(0, 200);
  }

  return Object.keys(result).length ? result : null;
}

function parseLocation(location: LocationInput) {
  if (!location || typeof location !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location must be an object',
    });
  }

  const cityInfo = getCityById(location.cityId || '');

  if (!cityInfo || cityInfo.id === 'all') {
    throw createError({
      statusCode: 400,
      statusMessage: 'City is required',
    });
  }

  const cityName = location.cityName?.trim() || cityInfo.name;

  return {
    cityId: cityInfo.id,
    cityName,
  };
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in to create a post',
    });
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('phone')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load user profile',
    });
  }

  if (!profile?.phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone number is required to create a post',
    });
  }

  const body = await readBody<{
    categoryId: string;
    subcategoryId?: string;
    brandId?: string;
    title: string;
    description: string;
    price: number | string;
    location: LocationInput;
    images: ImageInput[];
    attributes?: Record<string, unknown>;
  }>(event);

  const {
    categoryId,
    subcategoryId,
    brandId,
    title,
    description,
    price,
    location,
    images,
    attributes,
  } = body || {};

  if (!title || !description || !price || !categoryId || !location || !images?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const parsedPrice =
        typeof price === 'string' ? parseInt(price, 10) : Number(price);

  if (Number.isNaN(parsedPrice)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be a valid number',
    });
  }

  const locationData = parseLocation(location);

  const postId = randomUUID();
  const bucketName = 'media';

  const uploadedImages = await Promise.all(
    images.map(img => uploadPostImage(client, img, postId, { bucketName })),
  );

  const firstImage = images[0];
  const preview = await uploadPostImage(client, firstImage, postId, {
    small: true,
    bucketName,
  });

  const { error: insertError } = await client
    .from('posts')
    .insert({
      id: postId,
      'fs_id': null,
      'user_id': user.id,
      'author_id': user.id,
      title,
      description,
      price: parsedPrice,
      status: 'open',
      'brand_id': brandId || null,
      'category_id': categoryId,
      'subcategory_id': subcategoryId || null,
      preview,
      images: uploadedImages,
      'location_city': locationData.cityName,
      'location_display_name': locationData.cityName,
      'location_lat': null,
      'location_lon': null,
      attributes: normalizeAttributes(attributes, categoryId, subcategoryId),
    })
    .single();

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create a post',
    });
  }

  return { id: postId };
});
