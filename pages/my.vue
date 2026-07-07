<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

useHead({
  meta: [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }],
});

const tabs = [
  { label: 'Meus anúncios', icon: 'i-lucide-list', to: { name: 'my-ads' } },
  { label: 'Favoritos', icon: 'i-lucide-heart', to: { name: 'my-favorites' } },
  { label: 'Configurações', icon: 'i-lucide-settings', to: { name: 'my-settings' } },
];
</script>

<template>
  <div class="space-y-4">
    <nav class="flex gap-1 rounded-xl bg-elevated p-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        v-slot="{ isActive, href, navigate }"
        :to="tab.to"
        custom
      >
        <a
          :href="href"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors"
          :class="isActive
            ? 'bg-default shadow-sm text-highlighted'
            : 'text-muted hover:text-highlighted'"
          @click="navigate"
        >
          <UIcon
            :name="tab.icon"
            class="size-4"
          />

          <span class="hidden sm:inline">{{ tab.label }}</span>
        </a>
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>
