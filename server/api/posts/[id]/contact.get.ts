import { serverSupabaseServiceRole } from '#supabase/server';
import { checkRateLimit } from '~~/server/utils/rateLimit';


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Телефон продавца по клику «Mostrar contacto».
 *
 * Номер намеренно не входит в /api/posts/[id]: отдельный эндпоинт
 * с rate-limit делает массовый парсинг базы продавцов дорогим,
 * а клик по кнопке — первой измеримой метрикой лида (view_contact).
 */
export default defineEventHandler(async (event) => {
  const postId = event.context.params?.id as string;

  if (!UUID_RE.test(postId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post id' });
  }

  // покупателю хватает с запасом, парсеру базы — нет
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown';

  if (!checkRateLimit(`contact:${ip}`, 30, 60 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Muitos pedidos. Tente novamente mais tarde.' });
  }

  const client = serverSupabaseServiceRole(event);

  const { data: post, error: postError } = await client
    .from('posts')
    .select('id, author_id, status')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    throw createError({ statusCode: 500, statusMessage: postError.message });
  }

  if (!post || !post.author_id) {
    throw createError({ statusCode: 404, statusMessage: 'Anúncio não encontrado' });
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('phone')
    .eq('id', post.author_id)
    .maybeSingle();

  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: profileError.message });
  }

  if (!profile?.phone) {
    throw createError({ statusCode: 404, statusMessage: 'Contacto indisponível' });
  }

  return { phone: profile.phone };
});
