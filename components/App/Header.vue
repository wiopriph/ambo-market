<script setup lang="ts">
import {
  CLICK_LOGIN_BUTTON,
  CLICK_MY_ADS_BUTTON,
  CLICK_POST_AD_BUTTON,
  CLICK_SETTINGS_BUTTON,
  CLICK_USER_BUTTON,
  SEARCH_SUBMIT,
} from '~/constants/analytics-events';
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';


const { t } = useI18n();
const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const {
  cityId,
  currentFilters,
  getFilter,
  isPriorityCity,
} = usePosts();

const indexRoute = computed(() => {
  if (isPriorityCity.value) {
    return {
      name: 'cityId',
      params: {
        cityId: cityId.value,
      },
    };
  }

  return { name: 'index' };
});

const searchString = ref('');

onMounted(() => {
  searchString.value = getFilter('q');
});

watch(
  () => route.query.q,
  () => {
    searchString.value = getFilter('q');
  },
);

const searchPlaceholder = computed(() => {
  const { categoryId } = route.params;

  if (categoryId) {
    return t('search_in_category', { category: t(`${categoryId}`) });
  }

  return t('search');
});

const find = () => {
  const query = {
    ...currentFilters.value,
    q: searchString.value,
  };

  const params: Record<string, string> = {
    cityId: cityId.value || 'all',
  };

  const valuesMap = {
    categoryId: route.params.categoryId,
    subcategoryId: route.params.subcategoryId,
    brandId: route.params.brandId,
  };

  const keys = ['categoryId', 'subcategoryId', 'brandId'];

  for (const key of keys) {
    const value = valuesMap[key as keyof typeof valuesMap];

    if (value) {
      params[key] = value as string;
    } else {
      break;
    }
  }

  const name = Object.keys(params).join('-');

  pushEvent(SEARCH_SUBMIT, { query: searchString.value });

  return navigateTo({ name, params, query });
};

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
    "search": "What are you looking for?",
    "search_in_category": "Search in {category}",
    "place_ad": "Post ad",
    "account": "Account",
    "ads": "My ads",
    "settings": "Settings",
    "sign_in": "Login",
    "logout": "Logout"
  },
  "pt": {
    "main_page": "Página inicial",
    "search": "O que procuras?",
    "search_in_category": "Buscar em {category}",
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
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75">
    <div class="mx-auto max-w-6xl px-2 py-2 sm:px-2 lg:px-4">
      <div class="grid grid-cols-[auto_auto] items-center justify-between gap-x-4 gap-y-4 md:grid-cols-[auto_minmax(240px,1fr)_auto]">
        <ULink
          :to="indexRoute"
          :aria-label="t('main_page')"
          class="col-start-1 row-start-1 flex shrink-0 items-center rounded-md outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <NuxtImg
            src="/icon-logo.svg"
            alt="Ambo Market"
            width="180"
            height="32"
            class="h-6 w-auto"
          />
        </ULink>

        <form
          class="col-span-2 row-start-2 flex min-w-0 items-center rounded-lg border border-primary/25 md:col-span-1 md:col-start-2 md:row-start-1"
          @submit.prevent="find"
        >
          <UInput
            v-model="searchString"
            :placeholder="searchPlaceholder"
            icon="i-lucide-search"
            name="search"
            type="search"
            size="sm"
            class="min-w-0 flex-1"
            :ui="{
              root: 'w-full',
              base: 'border-0 bg-transparent px-2 text-lg shadow-none ring-0 placeholder:text-slate-400 focus:ring-0 focus-visible:ring-0 md:text-base'
            }"
          />
        </form>

        <div class="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2 md:col-start-3">
          <UButton
            color="primary"
            icon="i-lucide-plus"
            size="md"
            class="rounded-lg px-3 font-semibold"
            @click="goToCreatePage"
          >
            <span
              class="hidden sm:inline"
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
      </div>
    </div>
  </header>
</template>
