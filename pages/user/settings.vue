<script setup lang="ts">
// старый URL: оставлен как 301-редирект на /my/settings
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => navigateTo({ name: 'my-settings' }, { redirectCode: 301 })),
});
</script>
