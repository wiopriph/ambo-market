export type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type User = {
  id: string;
  name: string | null;
  photoURL: string | null;
  phone: string | null;
  email: string | null;
};

export type ProfileImageInput = {
  base64: string;
  mimeType: string;
};

export type ProfileUpdateInput = {
  display_name?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: ProfileImageInput | null;
};

export function useUser() {
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


  const setCurrentUser = (profile: DbProfile | null) => {
    if (!profile) {
      currentUser.value = null;

      return;
    }

    currentUser.value = mapDbProfileToUser(profile);
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

    currentUser.value = await $fetch<User>(`/api/users/${uid.value}`, {
      method: 'PATCH',
      body: profileData,
    });
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
