import { randomUUID } from 'node:crypto';
import { defineEventHandler, readBody, createError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { uploadPostImage, type ImageInput } from '~~/server/utils/images';
import { getCityById } from '~/constants/cities';


type LocationInput = {
  cityId?: string;
  city?: string;
  displayName?: string;
};

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

  const displayName = location.displayName?.trim() || cityInfo.name;

  return {
    cityId: cityInfo.id,
    city: cityInfo.name,
    displayName,
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
      location_city: locationData.city,
      location_display_name: locationData.displayName,
      location_lat: null,
      location_lon: null,
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
