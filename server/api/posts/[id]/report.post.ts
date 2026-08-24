import { createHash } from 'node:crypto';
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { checkRateLimit } from '~~/server/utils/rateLimit';
import { sendTelegramMessage } from '~~/server/utils/telegram';


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const REPORT_REASONS = ['fraud', 'prohibited', 'spam', 'misleading', 'other'] as const;

type ReportReason = typeof REPORT_REASONS[number];

const isReason = (v: unknown): v is ReportReason => REPORT_REASONS.includes(v as ReportReason);

const REASON_LABELS: Record<ReportReason, string> = {
  fraud: 'Fraude ou burla',
  prohibited: 'Produto proibido',
  spam: 'Anúncio duplicado ou spam',
  misleading: 'Preço ou descrição enganosa',
  other: 'Outro motivo',
};

const AUTO_HOLD_THRESHOLD = 3;

export default defineEventHandler(async (event) => {
  const postId = event.context.params?.id as string;

  if (!UUID_RE.test(postId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post id' });
  }

  const body = await readBody<{
    reason?: string;
    comment?: string;
    honeypot?: string;
  }>(event);

  if (body?.honeypot) {
    return { ok: true };
  }

  if (!isReason(body?.reason)) {
    throw createError({ statusCode: 400, statusMessage: 'Motivo inválido' });
  }

  const comment = (body?.comment ?? '').trim().slice(0, 1000);

  if (body.reason === 'other' && comment.length < 5) {
    throw createError({ statusCode: 400, statusMessage: 'Descreva o motivo da denúncia' });
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown';

  if (!checkRateLimit(`report:${ip}`, 3, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Muitas denúncias. Tente novamente mais tarde.' });
  }

  const config = useRuntimeConfig();
  const client = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event).catch(() => null);

  const ipHash = createHash('sha256')
    .update(`${ip}:${config.supabase.serviceKey}`)
    .digest('hex');

  const { data: post, error: postError } = await client
    .from('posts')
    .select('id, title, status, author_id')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    throw createError({ statusCode: 500, statusMessage: postError.message });
  }

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Anúncio não encontrado' });
  }

  if (user && post.author_id === user.id) {
    throw createError({ statusCode: 400, statusMessage: 'Não pode denunciar o seu próprio anúncio' });
  }

  const { data: existing } = await client
    .from('post_reports')
    .select('id')
    .eq('post_id', postId)
    .or(user ? `reporter_id.eq.${user.id},reporter_ip_hash.eq.${ipHash}` : `reporter_ip_hash.eq.${ipHash}`)
    .limit(1);

  if (existing?.length) {
    return { ok: true };
  }

  const { error: insertError } = await client
    .from('post_reports')
    .insert({
      'post_id': postId,
      reason: body.reason,
      comment: comment || null,
      'reporter_id': user?.id ?? null,
      'reporter_ip_hash': ipHash,
    });

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível enviar a denúncia' });
  }

  const { data: reports } = await client
    .from('post_reports')
    .select('reporter_id, reporter_ip_hash')
    .eq('post_id', postId);

  const uniqueReporters = new Set(
    (reports ?? []).map(report => report.reporter_id ?? report.reporter_ip_hash),
  ).size;

  let autoHeld = false;

  if (uniqueReporters >= AUTO_HOLD_THRESHOLD && post.status === 'open') {
    const { error: holdError } = await client
      .from('posts')
      .update({ status: 'hold', 'updated_at': new Date().toISOString() })
      .eq('id', postId);

    autoHeld = !holdError;
  }

  const baseUrl = (config.public.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');

  await sendTelegramMessage(
    [
      autoHeld ? '🚫 [AUTO-HOLD] Anúncio suspenso por denúncias' : '🚩 Nova denúncia',
      `Anúncio: ${post.title ?? postId}`,
      `Motivo: ${REASON_LABELS[body.reason]}`,
      comment ? `Detalhes: ${comment.slice(0, 300)}` : null,
      `Denúncias únicas: ${uniqueReporters}`,
      `${baseUrl}/product/${postId}`,
    ].filter(Boolean).join('\n'),
  );

  return { ok: true };
});
