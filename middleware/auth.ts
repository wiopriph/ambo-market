import { useUser } from '~/composables/useUser';


export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn.value) {
    return navigateTo(`/auth?redirect=${to.path}`);
  }
});
