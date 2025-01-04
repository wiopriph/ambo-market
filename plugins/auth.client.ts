import { useUser } from '~/composables/useUser';


export default defineNuxtPlugin(() => {
  const { $fire } = useNuxtApp();

  const {
    isAuthChecking,
    fetchProfile,
    setCurrentUser,
  } = useUser();

  $fire.auth.onAuthStateChanged(async (user) => {
    isAuthChecking.value = true;

    if (user) {
      try {
        await fetchProfile();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error while fetching user profile:', error);
      }
    } else {
      setCurrentUser(null);
    }

    isAuthChecking.value = false;
  });
});
