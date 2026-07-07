import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';


export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in',
    });
  }

  const postId = event.context.params!.postId as string;

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' });
  }

  const client = await serverSupabaseClient(event);

  const { error } = await client
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('post_id', postId);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { ok: true };
});
