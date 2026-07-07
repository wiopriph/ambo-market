import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in',
    });
  }

  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from('favorites')
    .select('post_id')
    .eq('user_id', user.id);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return {
    ids: (data ?? []).map(row => row.post_id as string),
  };
});
