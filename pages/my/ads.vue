<script setup lang="ts">
import { useUser } from '~/composables/useUser';


useHead({ title: 'Meus anúncios - Ambo Market' });

const route = useRoute();
const { uid } = useUser();

const STATUSES = ['open', 'closed'] as const;

const currentStatus = computed(() => {
  const status = route.query.status as string;

  return STATUSES.includes(status as typeof STATUSES[number]) ? status : 'all';
});

const { data: posts, status: fetchStatus } = await useLazyAsyncData(
  () => `my-posts-${currentStatus.value}`,
  () => $fetch(`/api/users/${uid.value}/posts`, {
    params: currentStatus.value === 'all' ? {} : { status: currentStatus.value },
  }),
  { watch: [currentStatus], server: false },
);

const isLoading = computed(() => fetchStatus.value === 'pending');

const EMPTY_TEXTS: Record<string, string> = {
  all: 'Ainda não há anúncios.',
  open: 'Nenhum anúncio ativo.',
  closed: 'Nenhum anúncio vendido.',
};

const tabs = [
  { label: 'Todos', status: undefined },
  { label: 'Ativo', status: 'open' },
  { label: 'Vendido', status: 'closed' },
];

const emptyText = computed(() => EMPTY_TEXTS[currentStatus.value] ?? EMPTY_TEXTS.all);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-lg font-bold text-highlighted">
        Meus anúncios
      </h1>

      <UButton
        label="Criar anúncio"
        icon="i-lucide-plus"
        color="primary"
        size="sm"
        :to="{ name: 'product-create' }"
      />
    </div>

    <div class="grid grid-cols-3 gap-1 rounded-xl bg-elevated p-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        v-slot="{ href, navigate }"
        :to="{ name: 'my-ads', query: tab.status ? { status: tab.status } : {} }"
        custom
      >
        <a
          :href="href"
          class="flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors"
          :class="(tab.status ?? 'all') === currentStatus
            ? 'bg-default shadow-sm text-highlighted'
            : 'text-muted hover:text-highlighted'"
          @click="navigate"
        >
          {{ tab.label }}
        </a>
      </NuxtLink>
    </div>

    <ProductList
      :list="(posts as any)"
      :isLoading="isLoading"
      :emptyText="emptyText"
    />
  </div>
</template>
