export function useAuth() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const signUp = (email: string, password: string) =>
    client.auth.signUp({ email, password });

  const signIn = (email: string, password: string) =>
    client.auth.signInWithPassword({ email, password });

  const signOut = () => client.auth.signOut();

  // 👉 отправка письма для сброса пароля
  const resetPassword = (email: string) =>
    client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

  const updateUser = (payload: {
    email?: string;
    password?: string;
    data?: Record<string, any>;
  }) => client.auth.updateUser(payload);

  const signInWithProvider = (provider: 'google' | 'facebook') =>
    client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin, // или `${origin}/auth/callback`
      },
    });

  return {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    signInWithProvider,
  };
}
