import { useUser } from '~/composables/useUser';


export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, currentUser } = useUser();

  if (!isLoggedIn.value) {
    return navigateTo(`/auth?redirect=${to.path}`);
  }

  if (!currentUser.value?.isAdmin) {
    return navigateTo('/');
  }
});
