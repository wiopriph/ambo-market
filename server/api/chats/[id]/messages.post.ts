import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { getChatForUser } from '~~/server/utils/chats';
import { checkBlocklist } from '~~/server/utils/blocklist';
import { checkRateLimit } from '~~/server/utils/rateLimit';
import { sendTelegramMessage } from '~~/server/utils/telegram';


/** Отправить сообщение в диалог. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  if (!checkRateLimit(`chat-message:${user.id}`, 30, 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Muitas mensagens. Aguarde um pouco.' });
  }

  const { body } = await readBody<{ body?: string }>(event) ?? {};
  const text = (body ?? '').trim().slice(0, 4000);

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'Mensagem vazia' });
  }

  const client = serverSupabaseServiceRole(event);
  const chat = await getChatForUser(client, event.context.params!.id as string, user.id);

  // казино-номер в личке = тот же спамер, что и в постах: тихий пермабан,
  // сообщение "отправлено", но не сохраняется и собеседнику не уходит
  const blockMatch = await checkBlocklist(client, { text });

  if (blockMatch?.kind === 'phone') {
    await client.auth.admin.updateUserById(user.id, { 'ban_duration': '876000h' });

    const { data: profile } = await client
      .from('profiles')
      .select('phone')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.phone) {
      await client
        .from('blocklist')
        .upsert(
          { kind: 'phone', value: profile.phone.replace(/\D/g, ''), note: 'auto: mensagem com número bloqueado' },
          { onConflict: 'kind,value' },
        );
    }

    await sendTelegramMessage([
      '🤖 Автобан: сообщение в чате с заблокированным номером (не доставлено)',
      `Блоклист: ${blockMatch.value}`,
      `User: ${user.id}`,
    ].join('\n'));

    return {
      id: crypto.randomUUID(),
      body: text,
      createdAt: new Date().toISOString(),
      isMine: true,
      readAt: null,
    };
  }

  const { data: message, error } = await client
    .from('messages')
    .insert({ 'chat_id': chat.id, 'sender_id': user.id, body: text })
    .select('id, body, created_at')
    .single();

  if (error || !message) {
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível enviar a mensagem' });
  }

  await client
    .from('chats')
    .update({ 'last_message_at': message.created_at })
    .eq('id', chat.id);

  return {
    id: message.id,
    body: message.body,
    createdAt: message.created_at,
    isMine: true,
    readAt: null,
  };
});
