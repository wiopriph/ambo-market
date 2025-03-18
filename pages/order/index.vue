<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn, uid } = useUser();

    if (isLoggedIn.value && uid.value) {
      return navigateTo({
        name: 'order-history-status',
        params: {
          status: 'buy',
        },
      });
    }

    return navigateTo(`/auth?redirect=${to.path}`);
  }),
});
</script>
