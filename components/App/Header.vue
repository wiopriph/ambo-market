<script setup lang="ts">
import {
  CLICK_FAVORITES_BUTTON,
  CLICK_LOGIN_BUTTON,
  CLICK_MY_ADS_BUTTON,
  CLICK_POST_AD_BUTTON,
  CLICK_SETTINGS_BUTTON,
  CLICK_USER_BUTTON,
} from '~/constants/analytics-events';
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';


const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const { cityId, isPriorityCity } = usePosts();

const indexRoute = computed(() => {
  if (isPriorityCity.value) {
    return { name: 'cityId', params: { cityId: cityId.value } };
  }

  return { name: 'index' };
});

const {
  isLoggedIn,
  currentUser,
} = useUser();

const goToLogin = () => {
  pushEvent(CLICK_LOGIN_BUTTON);

  navigateTo({
    name: 'auth',
    query: { redirect: route.fullPath as string },
  });
};

const goToCreatePage = () => {
  pushEvent(CLICK_POST_AD_BUTTON);

  navigateTo({ name: 'product-create' });
};

const { signOut } = useAuth();

const logout = async () => {
  try {
    await navigateTo({ name: 'auth' });

    await signOut();
  } catch (error) {
    console.error(error);
  }
};

const accountItems = computed(() => [
  [
    {
      label: 'Meus anúncios',
      icon: 'i-lucide-list',
      to: { name: 'user-ads' },
      onSelect: () => pushEvent(CLICK_MY_ADS_BUTTON),
    },
    {
      label: 'Favoritos',
      icon: 'i-lucide-heart',
      to: { name: 'user-favorites' },
      onSelect: () => pushEvent(CLICK_FAVORITES_BUTTON),
    },
    {
      label: 'Configurações',
      icon: 'i-lucide-settings',
      to: { name: 'user-settings' },
      onSelect: () => pushEvent(CLICK_SETTINGS_BUTTON),
    },
  ],
  [
    {
      label: 'Sair',
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onSelect: logout,
    },
  ],
]);

const profileName = computed(() => currentUser.value?.name || 'Conta');
const profileInitial = computed(() => profileName.value.charAt(0).toUpperCase());

const onAccountClick = () => {
  pushEvent(CLICK_USER_BUTTON);
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-default/80 backdrop-blur">
    <div class="mx-auto max-w-[1280px] px-4 sm:px-6">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 lg:h-12 lg:items-stretch lg:py-0">
        <ULink
          :to="indexRoute"
          aria-label="Página inicial"
          class="order-1 shrink-0 lg:flex lg:items-center"
        >
          <img
            src="/icon-logo.svg"
            alt="Ambo Market"
            width="180"
            height="32"
            class="h-6 w-auto"
          >
        </ULink>

        <div class="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3 lg:ml-0 lg:self-center">
          <UButton
            color="primary"
            icon="i-lucide-plus"
            size="md"
            aria-label="Publicar anúncio"
            @click="goToCreatePage"
          >
            <span class="hidden md:inline">Publicar anúncio</span>
          </UButton>

          <LazyUDropdownMenu
            v-if="isLoggedIn && currentUser"
            :items="accountItems"
            :content="{ align: 'end', sideOffset: 10 }"
          >
            <UButton
              aria-label="Conta"
              color="neutral"
              variant="ghost"
              class="rounded-full p-0"
              @click="onAccountClick"
            >
              <UAvatar
                :src="currentUser.photoURL || undefined"
                :alt="profileName"
                :text="profileInitial"
                size="md"
              />
            </UButton>
          </LazyUDropdownMenu>

          <UButton
            v-else
            label="Entrar"
            color="neutral"
            variant="ghost"
            size="md"
            @click="goToLogin"
          />
        </div>

        <div class="order-3 w-full lg:order-2 lg:flex lg:w-auto lg:flex-1 lg:items-center">
          <FilterSearchBar />
        </div>
      </div>
    </div>
  </header>
</template>
