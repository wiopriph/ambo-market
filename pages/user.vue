<script setup lang="ts">
import { useUser } from '~/composables/useUser';
import { formatFullDate } from '~/utils/formatDate';


const route = useRoute();

definePageMeta({
  middleware: defineNuxtRouteMiddleware(async (to) => {
    const userUid = to.params.userUid as string;
    const isFirebaseUid = (s: string) => /^[A-Za-z0-9]{24,40}$/.test(s);

    if (isFirebaseUid(userUid)) {
      try {
        const { newId } = await $fetch<{ newId: string }>(`/api/users/map/${userUid}`);

        if (newId) {
          return navigateTo(`/user/${newId}`, { redirectCode: 301 });
        }
      } catch {
        return abortNavigation({ statusCode: 404, statusMessage: 'User not found' });
      }
    }
  }),
});

const { data: user, error: userError } = await useAsyncData(
  () => `user-${route.params.userUid}`,
  async () => {
    try {
      return await $fetch<any>(`/api/users/${route.params.userUid}`);
    } catch (error_: any) {
      if (error_?.statusCode === 404 || error_?.message === 'User not found') {
        throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true });
      }

      throw createError({ statusCode: 500, statusMessage: 'Failed to load user data', fatal: true });
    }
  },
  { watch: [() => route.params.userUid] },
);

if (userError?.value) {
  throw createError(userError.value);
}

const { data: allPosts } = await useAsyncData(
  () => `user-posts-all-${route.params.userUid}`,
  () => $fetch<any[]>(`/api/users/${route.params.userUid}/posts`),
  { watch: [() => route.params.userUid] },
);

const { uid } = useUser();

const isCurrentUser = computed(() => !!uid.value && uid.value === route.params.userUid);

const userName = computed(() => user.value?.name || `User_${String(route.params.userUid).slice(0, 4)}`);

const userAvatar = computed(() => ({
  src: user.value?.photoURL,
  alt: userName.value,
  text: userName.value.slice(0, 2).toUpperCase(),
}));

const memberSince = computed(() => user.value?.creationTime ?
  formatFullDate(user.value.creationTime, 'pt') :
  '');

const stats = computed(() => {
  const list = allPosts.value ?? [];

  return {
    total: list.length,
    active: list.filter((p: any) => p.status === 'open').length,
    sold: list.filter((p: any) => p.status === 'closed').length,
  };
});

const title = computed(() => `${userName.value} – Ambo Market`);
const description = computed(() => `Veja o perfil e anúncios de ${userName.value} no Ambo Market.`);

useHead({
  title: title.value,
  meta: [
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:type', property: 'og:type', content: 'profile' },
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'og:image', property: 'og:image', content: user.value?.photoURL || '' },
    { key: 'twitter:card', name: 'twitter:card', content: 'summary' },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
    { key: 'twitter:image', property: 'twitter:image', content: user.value?.photoURL || '' },
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      dateCreated: user.value?.creationTime,
      mainEntity: {
        '@type': 'Person',
        identifier: route.params.userUid,
        name: userName.value,
        image: user.value?.photoURL,
      },
    }),
  }],
});
</script>

<template>
  <div class="space-y-5">
    <div class="rounded-2xl border border-default bg-default p-5 space-y-5">
      <div class="flex items-start gap-4">
        <UAvatar
          v-bind="userAvatar"
          size="2xl"
          class="shrink-0 ring-2 ring-default"
        />

        <div class="min-w-0 flex-1 pt-0.5">
          <h1
            class="truncate text-lg font-bold text-highlighted leading-tight"
            v-text="userName"
          />

          <p
            v-if="memberSince"
            class="mt-0.5 text-xs text-muted"
          >
            Membro desde {{ memberSince }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-1.5">
          <UButton
            v-if="isCurrentUser"
            icon="i-lucide-settings"
            color="neutral"
            variant="ghost"
            size="sm"
            :to="{ name: 'my-settings' }"
            aria-label="Configurações"
          />
        </div>
      </div>

      <div class="grid grid-cols-3 divide-x divide-default rounded-xl border border-default overflow-hidden">
        <div class="flex flex-col items-center py-3 px-2">
          <span
            class="text-xl font-bold text-highlighted"
            v-text="stats.total"
          />

          <span class="mt-0.5 text-xs text-muted">Total</span>
        </div>

        <div class="flex flex-col items-center py-3 px-2">
          <span
            class="text-xl font-bold text-success"
            v-text="stats.active"
          />

          <span class="mt-0.5 text-xs text-muted">Ativo</span>
        </div>

        <div class="flex flex-col items-center py-3 px-2">
          <span
            class="text-xl font-bold text-highlighted"
            v-text="stats.sold"
          />

          <span class="mt-0.5 text-xs text-muted">Vendido</span>
        </div>
      </div>

      <UButton
        v-if="isCurrentUser"
        label="Criar anúncio"
        icon="i-lucide-plus"
        color="primary"
        size="lg"
        block
        :to="{ name: 'product-create' }"
      />
    </div>

    <NuxtPage :userName="userName" />
  </div>
</template>
