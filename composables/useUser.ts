// как лежит в Supabase (таблица profiles)
export type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// как ожидает остальной фронт (старый формат)
export type User = {
  id: string;
  name: string | null;
  photoURL: string | null;
  phone: string | null;
  email: string | null;
};

export type ProfileUpdateInput = Partial<
  Pick<DbProfile, 'display_name' | 'avatar_url' | 'phone' | 'email'>
>;

export function useUser() {
  const client = useSupabaseClient();
  const supaUser = useSupabaseUser();

  const isAuthChecking = useState<boolean>('isAuthChecking', () => false);
  const currentUser = useState<User | null>('currentUser', () => null);
  const isInitialized = useState<boolean>('userStoreInitialized', () => false);

  const isLoggedIn = computed(() => !!supaUser.value);
  const uid = computed(() => supaUser.value?.id ?? null);

  const mapDbProfileToUser = (profile: DbProfile): User => ({
    id: profile.id,
    name: profile.display_name,
    photoURL: profile.avatar_url,
    phone: profile.phone,
    email: profile.email,
  });

  const setCurrentUser = (user: DbProfile | null) => {
    if (!user) {
      currentUser.value = null;

      return;
    }

    currentUser.value = mapDbProfileToUser(user);
  };

  const fetchProfile = async () => {
    if (!uid.value) {
      setCurrentUser(null);

      return;
    }

    currentUser.value = await $fetch<User>(`/api/users/${uid.value}`);
  };

  const updateProfile = async (profileData: ProfileUpdateInput) => {
    if (!uid.value) {
      return;
    }

    const { data, error } = await client
      .from('profiles')
      .update(profileData)
      .eq('id', uid.value)
      .select()
      .single();

    if (error) {
      console.error('Error while updating profile:', error);
      throw error;
    }

    setCurrentUser(data as DbProfile);
  };

  if (import.meta.client && !isInitialized.value) {
    isInitialized.value = true;

    watch(
      supaUser,
      async (user) => {
        isAuthChecking.value = true;

        if (user) {
          try {
            await fetchProfile();
          } catch (error) {
            console.error('Error while fetching user profile:', error);
          } finally {
            isAuthChecking.value = false;
          }
        } else {
          setCurrentUser(null);
          isAuthChecking.value = false;
        }
      },
      { immediate: true },
    );
  }

  return {
    isAuthChecking,
    currentUser, // в формате старого User
    isLoggedIn,
    uid,

    fetchProfile,
    updateProfile,
  };
}
