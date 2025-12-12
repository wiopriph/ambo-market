import { createError, defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { type ImageInput, uploadProfileImage } from '~~/server/utils/images';


type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ProfileUpdateInput = {
  display_name?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: ImageInput | null;
};

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id as string;
  const client = await serverSupabaseClient(event);
  const currentUser = await serverSupabaseUser(event);

  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  if (currentUser.id !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const body = await readBody<ProfileUpdateInput>(event);

  const updateData: Partial<DbProfile> & { updated_at?: string } = {};

  if (body.display_name !== undefined) {
    updateData.display_name = body.display_name?.trim() || null;
  }

  if (body.phone !== undefined) {
    updateData.phone = body.phone?.replace(/\s+/g, '') || null;
  }

  if (body.email !== undefined) {
    updateData.email = body.email?.trim() || null;
  }

  if (body.image) {
    updateData.avatar_url = await uploadProfileImage(client as any, body.image, userId, {
      bucketName: 'media',
    });
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await client
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select('id, display_name, avatar_url, email, phone, created_at')
    .single();

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error while updating profile',
    });
  }

  return {
    id: data.id,
    name: data.display_name ?? null,
    creationTime: data.created_at ?? null,
    emailVerified: false,
    photoURL: data.avatar_url ?? null,
    disabled: false,
    email: data.email ?? null,
    phone: data.phone ?? null,
  };
});
