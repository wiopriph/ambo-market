import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';


async function getCurrentUserSafe(event) {
  try {
    return await serverSupabaseUser(event);
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const userId = event.context.params!.id as string;
  const client = await serverSupabaseClient(event);
  const currentUser = await getCurrentUserSafe(event);

  const { data: profile, error } = await client
    .from('profiles')
    .select('id, display_name, avatar_url, email, phone, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const isSelf = currentUser?.id === userId;

  return {
    id: profile.id,
    name: profile.display_name ?? null,
    creationTime: profile.created_at ?? null,
    emailVerified: false,
    photoURL: profile.avatar_url ?? null,
    disabled: false,
    ...(isSelf ? { email: profile.email ?? null, phone: profile.phone ?? null } : {}),
  };
});
