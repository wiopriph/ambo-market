import { createError, defineEventHandler, readBody } from 'h3';
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server';
import { type ImageInput, uploadProfileImage } from '~~/server/utils/images';
import { PHONE_REG_EXP } from '~/constants/reg-exps';
import { checkBlocklist } from '~~/server/utils/blocklist';
import { sendTelegramMessage } from '~~/server/utils/telegram';


type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ProfileUpdateInput = {
  display_name?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: ImageInput | null;
};

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id as string;
  const client = serverSupabaseServiceRole(event);
  // serverSupabaseUser бросает «Auth session missing!» вместо null для гостя —
  // ловим, чтобы отдать честный 401, а не 500
  const currentUser = await serverSupabaseUser(event).catch(() => null);

  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  if (currentUser.id !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const body = await readBody<ProfileUpdateInput>(event);

  const updateData: Partial<DbProfile> & { updated_at?: string } = {};

  if (body.display_name !== undefined) {
    updateData['display_name'] = body.display_name?.trim() || null;
  }

  if (body.phone !== undefined) {
    // телефон нельзя стереть: продавец без номера оставляет объявления
    // без контакта. Пустой или невалидный номер отклоняем, а не пишем NULL.
    const normalizedPhone = (body.phone ?? '').replace(/\s+/g, '');

    if (!PHONE_REG_EXP.test(normalizedPhone)) {
      throw createError({ statusCode: 400, statusMessage: 'Número de telefone inválido' });
    }

    // попытка привязать заблокированный номер = спамерский аккаунт.
    const blocked = await checkBlocklist(client, { phone: normalizedPhone });

    if (blocked) {
      await client.auth.admin.updateUserById(userId, { 'ban_duration': '876000h' });

      await sendTelegramMessage([
        '🤖 Auto-ban: tentativa de usar número bloqueado',
        `Número: ${normalizedPhone} (blocklist: ${blocked.value})`,
        `User: ${userId}`,
      ].join('\n'));

      const { data: current } = await client
        .from('profiles')
        .select('id, display_name, avatar_url, email, phone, created_at')
        .eq('id', userId)
        .single();

      // ответ неотличим от успешного — но без сохранения номера
      return {
        id: current?.id ?? userId,
        name: current?.display_name ?? null,
        creationTime: current?.created_at ?? null,
        emailVerified: false,
        photoURL: current?.avatar_url ?? null,
        disabled: false,
        email: current?.email ?? null,
        phone: current?.phone ?? null,
      };
    }

    updateData.phone = normalizedPhone;
  }

  if (body.email !== undefined) {
    updateData.email = body.email?.trim() || null;
  }

  if (body.image) {
    updateData['avatar_url'] = await uploadProfileImage(client as any, body.image, userId, {
      bucketName: 'media',
    });
  }

  updateData['updated_at'] = new Date().toISOString();

  const { data, error } = await client
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select('id, display_name, avatar_url, email, phone, created_at')
    .single();

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error while updating profile',
    });
  }

  return {
    id: data.id,
    name: data.display_name ?? null,
    creationTime: data.created_at ?? null,
    emailVerified: false,
    photoURL: data.avatar_url ?? null,
    disabled: false,
    email: data.email ?? null,
    phone: data.phone ?? null,
  };
});
