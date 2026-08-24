/**
 * Уведомления в Telegram (модерация, жалобы).
 *
 * Без настроенных NUXT_TELEGRAM_BOT_TOKEN / NUXT_TELEGRAM_CHAT_ID тихо
 * ничего не делает — фича опциональна и не должна ронять основной поток.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const { telegram } = useRuntimeConfig();

  if (!telegram?.botToken || !telegram?.chatId) {
    return;
  }

  try {
    await $fetch(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
      method: 'POST',
      body: {
        'chat_id': telegram.chatId,
        text,
        'disable_web_page_preview': true,
      },
      timeout: 5000,
    });
  } catch (error) {
    // уведомление не критично: жалоба уже сохранена в БД
    console.error('Telegram notify failed:', error);
  }
}
