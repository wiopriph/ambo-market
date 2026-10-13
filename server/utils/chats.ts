import type { SupabaseClient } from '@supabase/supabase-js';


export type ChatRow = {
  id: string;
  'post_id': string | null;
  'buyer_id': string;
  'seller_id': string;
  'created_at': string;
  'last_message_at': string | null;
};

/** Чат, если пользователь его участник; иначе 404 (не раскрываем существование). */
export async function getChatForUser(
  client: SupabaseClient,
  chatId: string,
  userId: string,
): Promise<ChatRow> {
  const { data, error } = await client
    .from('chats')
    .select('id, post_id, buyer_id, seller_id, created_at, last_message_at')
    .eq('id', chatId)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  const chat = data as ChatRow | null;

  if (!chat || (chat.buyer_id !== userId && chat.seller_id !== userId)) {
    throw createError({ statusCode: 404, statusMessage: 'Conversa não encontrada' });
  }

  return chat;
}
