<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';
import {
  CLICK_FAVORITES_BUTTON,
  CLICK_LOGIN_BUTTON,
  CLICK_MY_ADS_BUTTON,
  CLICK_POST_AD_BUTTON,
  CLICK_USER_BUTTON,
} from '~/constants/analytics-events';


const route = useRoute();
const { pushEvent } = useAnalyticsEvent();
const { cityId, isPriorityCity } = usePosts();
const { isLoggedIn } = useUser();

// у страницы товара свой закреплённый блок контактов — навигацию там не показываем
const isProductPage = computed(() => String(route.name ?? '').includes('productId'));

// на страницах авторизации текущий URL в redirect не заворачиваем —
// иначе каждый клик по «Entrar» вкладывает redirect в redirect
const loginRoute = computed(() => {
  if (String(route.name ?? '').startsWith('auth')) {
    return { name: 'auth', query: route.query };
  }

  return { name: 'auth', query: { redirect: route.fullPath } };
});

const homeRoute = computed(() =>
  isPriorityCity.value ? { name: 'cityId', params: { cityId: cityId.value } } : { name: 'index' });

const isHomeActive = computed(() => route.name === 'index' || route.name === 'cityId');

const profileTab = computed(() => isLoggedIn.value ?
  {
    label: 'Perfil',
    icon: 'i-lucide-user',
    to: { name: 'my-settings' },
    event: CLICK_USER_BUTTON,
  } :
  {
    label: 'Entrar',
    icon: 'i-lucide-log-in',
    to: loginRoute.value,
    event: CLICK_LOGIN_BUTTON,
  });

const isActive = (name: string) => String(route.name ?? '').startsWith(name);

const onProfileClick = () => {
  pushEvent(profileTab.value.event);
  navigateTo(profileTab.value.to);
};
</script>

<template>
  <template v-if="!isProductPage">
    <!-- распорка: не даёт фиксированной навигации перекрывать футер -->
    <div class="h-14 md:hidden" />

    <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-default/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div class="grid h-14 grid-cols-5">
        <NuxtLink
          :to="homeRoute"
          class="flex flex-col items-center justify-center gap-0.5"
          :class="isHomeActive ? 'text-primary' : 'text-muted'"
        >
          <UIcon
            name="i-lucide-house"
            class="size-5"
          />

          <span class="text-[10px] leading-none">Início</span>
        </NuxtLink>

        <NuxtLink
          :to="{ name: 'my-favorites' }"
          class="flex flex-col items-center justify-center gap-0.5"
          :class="isActive('my-favorites') ? 'text-primary' : 'text-muted'"
          @click="pushEvent(CLICK_FAVORITES_BUTTON)"
        >
          <UIcon
            name="i-lucide-heart"
            class="size-5"
          />

          <span class="text-[10px] leading-none">Favoritos</span>
        </NuxtLink>

        <div class="flex items-center justify-center">
          <NuxtLink
            :to="{ name: 'product-create' }"
            aria-label="Publicar anúncio"
            class="-mt-5 flex size-12 items-center justify-center rounded-full bg-primary text-inverted shadow-lg transition active:scale-95"
            @click="pushEvent(CLICK_POST_AD_BUTTON)"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-6"
            />
          </NuxtLink>
        </div>

        <NuxtLink
          :to="{ name: 'my-ads' }"
          class="flex flex-col items-center justify-center gap-0.5"
          :class="isActive('my-ads') ? 'text-primary' : 'text-muted'"
          @click="pushEvent(CLICK_MY_ADS_BUTTON)"
        >
          <UIcon
            name="i-lucide-list"
            class="size-5"
          />

          <span class="text-[10px] leading-none">Anúncios</span>
        </NuxtLink>

        <button
          type="button"
          class="flex flex-col items-center justify-center gap-0.5"
          :class="isActive('my') && !isActive('my-ads') && !isActive('my-favorites') ? 'text-primary' : 'text-muted'"
          @click="onProfileClick"
        >
          <UIcon
            :name="profileTab.icon"
            class="size-5"
          />

          <span
            class="text-[10px] leading-none"
            v-text="profileTab.label"
          />
        </button>
      </div>
    </nav>
  </template>
</template>
