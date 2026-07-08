import { serverSupabaseClient } from '#supabase/server';


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id as string;

  if (!UUID_RE.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post id' });
  }

  const client = await serverSupabaseClient(event);

  const { error } = await client.rpc('increment_post_views' as never, { 'post_id': id } as never);

  if (error) {
    // счётчик не критичен: не роняем страницу, просто логируем
    console.error('Failed to increment post views:', error.message);
  }

  return { ok: true };
});
