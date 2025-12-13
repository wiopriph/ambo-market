import { defineEventHandler, createError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';


export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  const postId = event.context.params?.id;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required',
    });
  }

  const { data: post, error: fetchError } = await client
    .from('posts')
    .select('id, author_id, status')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    });
  }

  if (post.author_id !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not allowed to close this post',
    });
  }

  if (post.status === 'closed') {
    return { success: true, status: 'already_closed' };
  }

  const { error: updateError } = await client
    .from('posts')
    .update({
      status: 'closed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to close post',
    });
  }

  return { success: true, status: 'closed' };
});
