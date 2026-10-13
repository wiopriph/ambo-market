import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { sendTelegramMessage } from '~~/server/utils/telegram';


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Начать (или вернуть существующий) диалог по объявлению. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const { postId } = await readBody<{ postId?: string }>(event) ?? {};

  if (!postId || !UUID_RE.test(postId)) {
    throw createError({ statusCode: 400, statusMessage: 'Anúncio inválido' });
  }

  const client = serverSupabaseServiceRole(event);

  // тот же барьер, что у постинга: без телефона не пишем
  const { data: profile } = await client
    .from('profiles')
    .select('phone, display_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Adicione o seu número de telefone nas definições para conversar',
    });
  }

  const { data: post } = await client
    .from('posts')
    .select('id, author_id, title, status')
    .eq('id', postId)
    .maybeSingle();

  if (!post?.author_id || post.status === 'removed') {
    throw createError({ statusCode: 404, statusMessage: 'Anúncio não encontrado' });
  }

  if (post.author_id === user.id) {
    throw createError({ statusCode: 400, statusMessage: 'Não pode conversar consigo mesmo' });
  }

  const { data: existing } = await client
    .from('chats')
    .select('id')
    .eq('post_id', postId)
    .eq('buyer_id', user.id)
    .maybeSingle();

  if (existing) {
    return { id: existing.id };
  }

  const { data: chat, error } = await client
    .from('chats')
    .insert({ 'post_id': postId, 'buyer_id': user.id, 'seller_id': post.author_id })
    .select('id')
    .single();

  if (error || !chat) {
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível iniciar a conversa' });
  }

  // пульс фичи в первые недели; потом можно убрать
  const baseUrl = (useRuntimeConfig().public.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');

  await sendTelegramMessage([
    '💬 Новый диалог',
    `Объявление: ${post.title}`,
    `Покупатель: ${profile.display_name || user.id}`,
    `${baseUrl}/product/${post.id}`,
  ].join('\n'));

  return { id: chat.id };
});
