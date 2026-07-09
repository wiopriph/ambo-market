import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { checkRateLimit } from '~~/server/utils/rateLimit';


const FEEDBACK_TYPES = ['idea', 'bug', 'complaint', 'other'] as const;

type FeedbackType = typeof FEEDBACK_TYPES[number];

const isType = (v: unknown): v is FeedbackType => FEEDBACK_TYPES.includes(v as FeedbackType);

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    message?: string;
    contact?: string;
    type?: string;
    pageUrl?: string;
    honeypot?: string; // ловушка для ботов: люди это поле не видят
  }>(event);

  // honeypot заполнен -> бот. Отвечаем «ок», чтобы не выдавать логику.
  if (body?.honeypot) {
    return { ok: true };
  }

  const message = (body?.message ?? '').trim();

  if (message.length < 5) {
    throw createError({ statusCode: 400, statusMessage: 'A mensagem é muito curta' });
  }

  if (message.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'A mensagem é muito longa' });
  }

  // rate-limit: не больше 5 сообщений с одного IP за 10 минут
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown';

  if (!checkRateLimit(`feedback:${ip}`, 5, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Muitas mensagens. Tente novamente mais tarde.' });
  }

  const user = await serverSupabaseUser(event).catch(() => null);
  const client = await serverSupabaseClient(event);

  const { error } = await client.from('feedback').insert({
    message,
    contact: (body?.contact ?? '').trim().slice(0, 200) || null,
    type: isType(body?.type) ? body.type : 'other',
    'page_url': (body?.pageUrl ?? '').slice(0, 500) || null,
    'user_id': user?.id ?? null,
    'user_agent': getHeader(event, 'user-agent')?.slice(0, 500) ?? null,
  } as never);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { ok: true };
});
