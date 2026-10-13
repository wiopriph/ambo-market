import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';


/** Непрочитанные сообщения во всех моих диалогах. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const client = serverSupabaseServiceRole(event);

  const { data: chats, error } = await client
    .from('chats')
    .select('id')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .limit(500);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  if (!chats?.length) {
    return { count: 0 };
  }

  const { count, error: countError } = await client
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .in('chat_id', chats.map(chat => chat.id))
    .neq('sender_id', user.id)
    .is('read_at', null);

  if (countError) {
    throw createError({ statusCode: 500, statusMessage: countError.message });
  }

  return { count: count ?? 0 };
});
