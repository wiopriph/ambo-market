import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { getChatForUser } from '~~/server/utils/chats';


/** Диалог целиком: собеседник, объявление, сообщения (старые -> новые). */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const client = serverSupabaseServiceRole(event);
  const chat = await getChatForUser(client, event.context.params!.id as string, user.id);

  const peerId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;

  const [{ data: peer }, { data: post }, { data: messages, error }] = await Promise.all([
    client
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', peerId)
      .maybeSingle(),
    chat.post_id ?
      client
        .from('posts')
        .select('id, title, preview, price, status, category_id, subcategory_id, brand_id, location_city')
        .eq('id', chat.post_id)
        .maybeSingle() :
      Promise.resolve({ data: null }),
    client
      .from('messages')
      .select('id, sender_id, body, created_at, read_at')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true })
      .limit(500),
  ]);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return {
    id: chat.id,
    peer: {
      id: peerId,
      name: peer?.display_name ?? null,
      photoURL: peer?.avatar_url ?? null,
    },
    post,
    messages: (messages ?? []).map(message => ({
      id: message.id,
      body: message.body,
      createdAt: message.created_at,
      isMine: message.sender_id === user.id,
      readAt: message.read_at,
    })),
  };
});
