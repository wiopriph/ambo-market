import { useUser } from '~/composables/useUser';


export default defineNuxtPlugin(() => {
  const { $fire } = useNuxtApp();

  const { fetchProfile, setCurrentUser } = useUser();

  $fire.auth.onAuthStateChanged(async (user) => {
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
  });
});
