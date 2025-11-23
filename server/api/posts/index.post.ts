import { randomUUID } from 'node:crypto';
import { defineEventHandler, readBody, createError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { uploadPostImage, type ImageInput } from '~~/server/utils/images';


type LocationInput = {
  city?: string;
  displayName: string;
  lat: number | string;
  lon: number | string;
};

function parseLocation(location: LocationInput) {
  if (!location || typeof location !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location must be an object',
    });
  }

  const { city = '', displayName, lat, lon } = location;

  if (!displayName.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Display name is required',
    });
  }

  const parsedLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  const parsedLon = typeof lon === 'string' ? parseFloat(lon) : lon;

  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Latitude and longitude must be valid numbers',
    });
  }

  return {
    city: city.trim(),
    displayName: displayName.trim(),
    lat: parsedLat,
    lon: parsedLon,
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

  const body = await readBody<{
    categoryId: string;
    subcategoryId?: string;
    brandId?: string;
    title: string;
    description: string;
    price: number | string;
    location: LocationInput;
    images: ImageInput[];
    isSafeDeal?: boolean;
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
    isSafeDeal = false,
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
      fs_id: null,
      user_id: user.id,
      author_id: user.id,
      title,
      description,
      price: parsedPrice,
      status: 'open',
      brand_id: brandId || null,
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      is_safe_deal: isSafeDeal,
      preview,
      images: uploadedImages,
      location_city: locationData.city || null,
      location_display_name: locationData.displayName,
      location_lat: locationData.lat,
      location_lon: locationData.lon,
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
