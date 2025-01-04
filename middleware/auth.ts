import { useUser } from '~/composables/useUser';


export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn.value) {
    return navigateTo(`/auth?redirect=${to.path}`);
  }
});
