/**
 * Telegram Bot API — голые fetch-запросы, без библиотек.
 *
 * Исходящие уведомления модерации + кнопки. Без NUXT_TELEGRAM_BOT_TOKEN /
 * NUXT_TELEGRAM_CHAT_ID тихо ничего не делает — фича опциональна.
 */

type InlineButton = { text: string; 'callback_data'?: string; url?: string };

export type InlineKeyboard = InlineButton[][];

async function callTelegram(method: string, body: Record<string, unknown>): Promise<void> {
  const { telegram } = useRuntimeConfig();

  if (!telegram?.botToken) {
    return;
  }

  try {
    await $fetch(`https://api.telegram.org/bot${telegram.botToken}/${method}`, {
      method: 'POST',
      body,
      timeout: 8000,
    });
  } catch (error) {
    console.error(`Telegram ${method} failed:`, error);
  }
}

/** Уведомление в чат модерации, опционально с кнопками. */
export async function sendTelegramMessage(text: string, keyboard?: InlineKeyboard): Promise<void> {
  const { telegram } = useRuntimeConfig();

  if (!telegram?.chatId) {
    return;
  }

  await callTelegram('sendMessage', {
    'chat_id': telegram.chatId,
    text,
    'disable_web_page_preview': true,
    ...(keyboard ? { 'reply_markup': { 'inline_keyboard': keyboard } } : {}),
  });
}

/** Перерисовать текст сообщения; без keyboard — кнопки убираются. */
export async function editTelegramMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  keyboard?: InlineKeyboard,
): Promise<void> {
  await callTelegram('editMessageText', {
    'chat_id': chatId,
    'message_id': messageId,
    text,
    'disable_web_page_preview': true,
    'reply_markup': { 'inline_keyboard': keyboard ?? [] },
  });
}

/** Заменить только клавиатуру (шаг подтверждения). */
export async function editTelegramKeyboard(
  chatId: number | string,
  messageId: number,
  keyboard: InlineKeyboard,
): Promise<void> {
  await callTelegram('editMessageReplyMarkup', {
    'chat_id': chatId,
    'message_id': messageId,
    'reply_markup': { 'inline_keyboard': keyboard },
  });
}

/** Ответ на нажатие кнопки — гасит спиннер, показывает тост. */
export async function answerCallback(callbackId: string, text?: string, alert = false): Promise<void> {
  await callTelegram('answerCallbackQuery', {
    'callback_query_id': callbackId,
    ...(text ? { text } : {}),
    'show_alert': alert,
  });
}

// ── клавиатуры модерации ──────────────────────────────────────────────────
// callback_data ≤ 64 байта: <действие>:<postId>

/** Три кнопки под уведомлением о новом объявлении или жалобе. */
export function moderationKeyboard(postId: string): InlineKeyboard {
  return [[
    { text: '🗑 Remover', 'callback_data': `del:${postId}` },
    { text: '🚫 Banir', 'callback_data': `ban:${postId}` },
    { text: '📘 FB', 'callback_data': `fb:${postId}` },
  ]];
}

/** Подтверждение бана. */
export function banConfirmKeyboard(postId: string): InlineKeyboard {
  return [[
    { text: '✅ Sim, banir', 'callback_data': `banc:${postId}` },
    { text: '✖ Não', 'callback_data': `bno:${postId}` },
  ]];
}
