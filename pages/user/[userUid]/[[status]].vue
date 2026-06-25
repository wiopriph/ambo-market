<script setup lang="ts">
defineProps<{ userName?: string }>();

definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { status } = to.params;

    if (!status || ['open', 'closed'].includes(status as string)) {
      return;
    }

    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }),
});

const route = useRoute();

const userUid = computed(() => route.params.userUid as string);
const currentStatus = computed(() => route.params.status as string || 'all');

const { data: posts } = await useAsyncData(
  () => `posts-${userUid.value}-${currentStatus.value}`,
  () => $fetch(`/api/users/${userUid.value}/posts`, { params: { status: route.params.status } }),
  { watch: [() => route.params] },
);

const EMPTY_TEXTS: Record<string, string> = {
  all: 'Ainda não há anúncios.',
  open: 'Nenhum anúncio ativo.',
  closed: 'Nenhum anúncio vendido.',
};

const tabs = computed(() => [
  { label: 'Todos', to: { name: 'user-userUid-status', params: { userUid: userUid.value, status: undefined } } },
  { label: 'Ativo', to: { name: 'user-userUid-status', params: { userUid: userUid.value, status: 'open' } } },
  { label: 'Vendido', to: { name: 'user-userUid-status', params: { userUid: userUid.value, status: 'closed' } } },
]);

const emptyText = computed(() => EMPTY_TEXTS[currentStatus.value] ?? EMPTY_TEXTS.all);
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-3 gap-1 rounded-xl bg-elevated p-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        v-slot="{ isExactActive, href, navigate }"
        :to="tab.to"
        custom
      >
        <a
          :href="href"
          class="flex items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors"
          :class="isExactActive
            ? 'bg-default shadow-sm text-highlighted'
            : 'text-muted hover:text-highlighted'"
          @click="navigate"
        >
          {{ tab.label }}
        </a>
      </NuxtLink>
    </div>

    <ProductList
      :list="posts as any"
      :emptyText="emptyText"
    />
  </div>
</template>
