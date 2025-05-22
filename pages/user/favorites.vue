<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn, uid } = useUser();

    if (isLoggedIn.value && uid.value) {
      return navigateTo({
        name: 'user-userUid-favorites',
        params: {
          userUid: uid.value,
        },
      });
    }

    return navigateTo({ name: 'auth', query: { redirect: to.path } });
  }),
});
</script>
