import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { getChatForUser } from '~~/server/utils/chats';


/** Отметить чужие сообщения прочитанными. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const client = serverSupabaseServiceRole(event);
  const chat = await getChatForUser(client, event.context.params!.id as string, user.id);

  const { error } = await client
    .from('messages')
    .update({ 'read_at': new Date().toISOString() })
    .eq('chat_id', chat.id)
    .neq('sender_id', user.id)
    .is('read_at', null);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { ok: true };
});
