<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware(async (to) => {
    const { isLoggedIn, uid } = useUser();

    if (isLoggedIn.value && uid.value) {
      return navigateTo({
        name: 'user-userUid-settings',
        params: {
          userUid: uid.value,
        },
      });
    }

    return navigateTo(`/auth?redirect=${to.path}`);
  }),
});
</script>
