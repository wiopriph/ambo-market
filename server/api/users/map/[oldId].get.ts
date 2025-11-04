import { serverSupabaseClient } from '#supabase/server';


const isFirebaseUid = (s: string) => /^[A-Za-z0-9]{24,40}$/.test(s); // Auth UID ~28 символов

export default defineEventHandler(async (event) => {
  const oldId = event.context.params?.oldId || '' as string;

  if (!isFirebaseUid(oldId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid legacy user id' });
  }

  const client = await serverSupabaseClient(event);
  const { data, error } = await client
    .from('user_id_map')
    .select('new_id')
    .eq('old_fs_uid', oldId)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  if (!data?.new_id) {
    throw createError({ statusCode: 404, statusMessage: 'Mapping not found' });
  }

  return { newId: data.new_id as string };
});
