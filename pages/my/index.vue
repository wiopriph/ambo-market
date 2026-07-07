<script setup lang="ts">
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => navigateTo({ name: 'my-ads' }, { redirectCode: 301 })),
});
</script>
