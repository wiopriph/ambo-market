<script setup lang="ts">
import {
  CLICK_LOGIN_BUTTON,
  CLICK_MY_ADS_BUTTON,
  CLICK_POST_AD_BUTTON,
  CLICK_SETTINGS_BUTTON,
  CLICK_USER_BUTTON,
} from '~/constants/analytics-events';
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';


const { t } = useI18n();
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
      label: t('ads'),
      icon: 'i-lucide-list',
      to: { name: 'user-ads' },
      onSelect: () => pushEvent(CLICK_MY_ADS_BUTTON),
    },
    {
      label: t('settings'),
      icon: 'i-lucide-settings',
      to: { name: 'user-settings' },
      onSelect: () => pushEvent(CLICK_SETTINGS_BUTTON),
    },
  ],
  [
    {
      label: t('logout'),
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onSelect: logout,
    },
  ],
]);

const profileName = computed(() => currentUser.value?.name || t('account'));
const profileInitial = computed(() => profileName.value.charAt(0).toUpperCase());

const onAccountClick = () => {
  pushEvent(CLICK_USER_BUTTON);
};
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Main page",
    "place_ad": "Post ad",
    "account": "Account",
    "ads": "My ads",
    "settings": "Settings",
    "sign_in": "Login",
    "logout": "Logout"
  },
  "pt": {
    "main_page": "Página inicial",
    "place_ad": "Publicar anúncio",
    "account": "Conta",
    "ads": "Meus anúncios",
    "settings": "Configurações",
    "sign_in": "Entrar",
    "logout": "Sair"
  }
}
</i18n>

<template>
  <header class="sticky top-0 z-50 bg-default/80 backdrop-blur">
    <div class="mx-auto max-w-6xl px-2 py-2 sm:px-2 lg:px-4">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 lg:h-12 lg:items-stretch lg:py-0">
        <ULink
          :to="indexRoute"
          :aria-label="t('main_page')"
          class="order-1 shrink-0 lg:flex lg:items-center"
        >
          <NuxtImg
            src="/icon-logo.svg"
            alt="Ambo Market"
            width="180"
            height="32"
            class="h-6 w-auto"
          />
        </ULink>

        <div class="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3 lg:ml-0 lg:self-center">
          <UButton
            color="primary"
            icon="i-lucide-plus"
            size="md"
            @click="goToCreatePage"
          >
            <span
              class="hidden md:inline"
              v-text="t('place_ad')"
            />
          </UButton>

          <UDropdownMenu
            v-if="isLoggedIn && currentUser"
            :items="accountItems"
            :content="{ align: 'end', sideOffset: 10 }"
          >
            <UButton
              :aria-label="t('account')"
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
          </UDropdownMenu>

          <UButton
            v-else
            :label="t('sign_in')"
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
