import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import type { ChatRow } from '~~/server/utils/chats';


/** Мои диалоги: собеседник, объявление, последнее сообщение, непрочитанные. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const client = serverSupabaseServiceRole(event);

  const { data: chatRows, error } = await client
    .from('chats')
    .select('id, post_id, buyer_id, seller_id, created_at, last_message_at')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(200);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  const chats = (chatRows ?? []) as ChatRow[];

  if (!chats.length) {
    return { chats: [] };
  }

  const chatIds = chats.map(chat => chat.id);
  const peerIds = chats.map(chat => chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id);
  const postIds = chats.map(chat => chat.post_id).filter(Boolean) as string[];

  const [{ data: peers }, { data: posts }, { data: recent }] = await Promise.all([
    client
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', peerIds),
    postIds.length ?
      client
        .from('posts')
        .select('id, title, preview, price, status')
        .in('id', postIds) :
      Promise.resolve({ data: [] }),
    client
      .from('messages')
      .select('chat_id, sender_id, body, created_at, read_at')
      .in('chat_id', chatIds)
      .order('created_at', { ascending: false })
      .limit(1000),
  ]);

  const peerById = new Map((peers ?? []).map(peer => [peer.id, peer]));
  const postById = new Map((posts ?? []).map(post => [post.id, post]));

  const lastByChat = new Map<string, { body: string; createdAt: string; isMine: boolean }>();
  const unreadByChat = new Map<string, number>();

  for (const message of recent ?? []) {
    if (!lastByChat.has(message.chat_id)) {
      lastByChat.set(message.chat_id, {
        body: message.body,
        createdAt: message.created_at,
        isMine: message.sender_id === user.id,
      });
    }

    if (!message.read_at && message.sender_id !== user.id) {
      unreadByChat.set(message.chat_id, (unreadByChat.get(message.chat_id) ?? 0) + 1);
    }
  }

  return {
    chats: chats.map((chat) => {
      const peer = peerById.get(chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id);
      const post = chat.post_id ? postById.get(chat.post_id) : null;

      return {
        id: chat.id,
        createdAt: chat.created_at,
        lastMessageAt: chat.last_message_at,
        peer: {
          id: peer?.id ?? null,
          name: peer?.display_name ?? null,
          photoURL: peer?.avatar_url ?? null,
        },
        post: post ?
          { id: post.id, title: post.title, preview: post.preview, price: post.price, status: post.status } :
          null,
        lastMessage: lastByChat.get(chat.id) ?? null,
        unreadCount: unreadByChat.get(chat.id) ?? 0,
      };
    }),
  };
});
