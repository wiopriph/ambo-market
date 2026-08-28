import { serverSupabaseServiceRole } from '#supabase/server';
import {
  answerCallback,
  banConfirmKeyboard,
  editTelegramKeyboard,
  editTelegramMessage,
  moderationKeyboard,
} from '~~/server/utils/telegram';


type TgCallback = {
  id: string;
  from: { id: number };
  message?: { 'message_id': number; chat: { id: number }; text?: string };
  data?: string;
};

// ≈ навсегда; снять бан: Dashboard → Authentication → Users → Unban
const BAN_FOREVER = '876000h';

const ACTIVE_STATUSES = ['open', 'hold'];

export default defineEventHandler(async (event) => {
  const { telegram, facebook, public: pub } = useRuntimeConfig();

  // секрет вебхука: без него эндпоинт закрыт наглухо
  const secret = getHeader(event, 'x-telegram-bot-api-secret-token');

  if (!telegram.webhookSecret || secret !== telegram.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const update = await readBody<{ 'callback_query'?: TgCallback }>(event);
  const cb = update?.callback_query;

  // интересуют только нажатия кнопок
  if (!cb?.message || !cb.data) {
    return { ok: true };
  }

  // модератор один: в личном чате user id совпадает с chat id
  if (String(cb.from.id) !== String(telegram.chatId)) {
    console.warn('Telegram: callback от неавторизованного id', cb.from.id);
    await answerCallback(cb.id);

    return { ok: true };
  }

  const client = serverSupabaseServiceRole(event);
  const chatId = cb.message.chat.id;
  const messageId = cb.message.message_id;
  const baseText = cb.message.text ?? '';
  const [action, postId] = cb.data.split(':');

  // финал: убрать кнопки, дописать результат к исходному тексту
  const finalize = (suffix: string) =>
    editTelegramMessage(chatId, messageId, `${baseText}\n\n${suffix}`);

  try {
    switch (action) {
      // ── 🗑 удалить объявление ────────────────────────────────────────
      case 'del': {
        const { data: post } = await client
          .from('posts')
          .select('id, status')
          .eq('id', postId)
          .maybeSingle();

        if (!post) {
          await answerCallback(cb.id, 'Anúncio não encontrado', true);

          return { ok: true };
        }

        if (post.status !== 'removed') {
          const { error } = await client
            .from('posts')
            .update({ status: 'removed', 'updated_at': new Date().toISOString() })
            .eq('id', postId);

          if (error) {
            await answerCallback(cb.id, `Erro: ${error.message.slice(0, 50)}`, true);

            return { ok: true };
          }
        }

        await answerCallback(cb.id, post.status === 'removed' ? 'Já removido' : 'Removido');
        await finalize('🗑 removido');

        return { ok: true };
      }

      // ── 🚫 бан: шаг подтверждения ────────────────────────────────────
      case 'ban': {
        await editTelegramKeyboard(chatId, messageId, banConfirmKeyboard(postId));
        await answerCallback(cb.id, 'Confirmar?');

        return { ok: true };
      }

      case 'bno': {
        await editTelegramKeyboard(chatId, messageId, moderationKeyboard(postId));
        await answerCallback(cb.id, 'Cancelado');

        return { ok: true };
      }

      // ── 🚫 бан подтверждён ───────────────────────────────────────────
      case 'banc': {
        const { data: post } = await client
          .from('posts')
          .select('author_id')
          .eq('id', postId)
          .maybeSingle();

        if (!post?.author_id) {
          await answerCallback(cb.id, 'Autor não encontrado', true);

          return { ok: true };
        }

        // штатный бан Supabase Auth — вход блокируется
        const { error: banError } = await client.auth.admin.updateUserById(post.author_id, {
          'ban_duration': BAN_FOREVER,
        });

        if (banError) {
          await answerCallback(cb.id, `Erro: ${banError.message.slice(0, 50)}`, true);

          return { ok: true };
        }

        // его активные объявления снимаем с сайта
        await client
          .from('posts')
          .update({ status: 'removed', 'updated_at': new Date().toISOString() })
          .eq('author_id', post.author_id)
          .in('status', ACTIVE_STATUSES);

        // номер — в блоклист: перерегистрация с ним не пройдёт
        const { data: bannedProfile } = await client
          .from('profiles')
          .select('phone')
          .eq('id', post.author_id)
          .maybeSingle();

        if (bannedProfile?.phone) {
          await client
            .from('blocklist')
            .upsert(
              { kind: 'phone', value: bannedProfile.phone.replace(/\D/g, ''), note: 'auto: banir' },
              { onConflict: 'kind,value' },
            );
        }

        await answerCallback(cb.id, 'Banido');
        await finalize('🚫 utilizador banido');

        return { ok: true };
      }

      // ── 📘 опубликовать ссылку на страницу Facebook ─────────────────
      case 'fb': {
        if (!facebook?.pageId || !facebook?.pageToken) {
          await answerCallback(cb.id, 'FB não configurado', true);

          return { ok: true };
        }

        const { data: post } = await client
          .from('posts')
          .select('id, title, price, location_city')
          .eq('id', postId)
          .maybeSingle();

        if (!post) {
          await answerCallback(cb.id, 'Anúncio não encontrado', true);

          return { ok: true };
        }

        const baseUrl = (pub.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');
        const link = `${baseUrl}/product/${postId}`;
        const price = post.price ? `${Number(post.price).toLocaleString('pt-AO')} Kz` : '';
        const message = [post.title, price, post.location_city ? `📍 ${post.location_city}` : '']
          .filter(Boolean)
          .join('\n');

        try {
          // link-post: превью (фото, заголовок) FB построит сам из og-тегов
          const res = await $fetch<{ id: string }>(
            `https://graph.facebook.com/v21.0/${facebook.pageId}/feed`,
            {
              method: 'POST',
              body: { message, link, 'access_token': facebook.pageToken },
              timeout: 15_000,
            },
          );

          const fbUrl = `https://facebook.com/${res.id}`;

          await answerCallback(cb.id, 'Publicado no FB');
          await finalize(`📘 publicado: ${fbUrl}`);
        } catch (error: any) {
          const message_ = error?.data?.error?.message || error?.message || 'erro';

          console.error('FB publish failed:', message_);
          await answerCallback(cb.id, `Erro FB: ${String(message_).slice(0, 50)}`, true);
        }

        return { ok: true };
      }

      default: {
        await answerCallback(cb.id);

        return { ok: true };
      }
    }
  } catch (error: any) {
    console.error('Telegram webhook failed:', error);
    // тост с ошибкой; сообщение не трогаем — кнопки остаются, можно повторить
    await answerCallback(cb.id, `Erro: ${String(error?.message ?? 'falha').slice(0, 50)}`, true);

    return { ok: true };
  }
});
