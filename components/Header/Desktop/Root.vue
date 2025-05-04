<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router';
import IconHamburger from '~/assets/images/header/icon-hamburger.svg?component';
import IconClose from '~/assets/images/header/icon-close.svg?component';
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';


const indexRoute = inject<RouteLocationRaw>('indexRoute');


const isMenuOpen = ref(false);

const openMenu = () => {
  isMenuOpen.value = true;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};


const isCategoryOpen = ref(false);

const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};


const isAuthModalVisible = ref(false);

const showAuthModal = () => {
  isAuthModalVisible.value = true;
};

const hideAuthModal = () => {
  isAuthModalVisible.value = false;
};


const route = useRoute();

const searchPlaceholder = computed(() => {
  const { categoryId } = route.params;

  if (categoryId) {
    return t('search_in_category', { category: t(`${categoryId}`) });
  }

  return t('search');
});


const {
  cityId,
  currentFilters,
  getFilter,
} = usePosts();


const searchString = ref('');

onMounted(() => {
  searchString.value = getFilter('q');
});


const find = () => {
  const categoryId = route.params.categoryId;
  const query = {
    ...currentFilters.value,
    q: searchString.value,
  };

  if (categoryId) {
    return navigateTo({
      name: 'cityId-categoryId',
      params: {
        cityId: cityId.value,
        categoryId,
      },
      query,
    });
  }

  return navigateTo({
    name: 'cityId',
    params: {
      cityId: cityId.value,
    },
    query,
  });
};


const goToCreatePage = () => {
  navigateTo({ name: 'product-create' });
};

const {
  isLoggedIn,
  currentUser,
} = useUser();

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "title": "Ambo Market – Buy and Sell in Angola | Free Classifieds",
    "main_page": "Home",
    "search": "Search anything...",
    "search_in_category": "Search in {category}",
    "find": "Search",
    "place_ad": "Post an Ad",
    "account": "My Account",
    "categories": "All Categories",
    "sign_in": "Sign In"
  },
  "pt": {
    "title": "Ambo Market – Compre e Venda em Angola | Anúncios Grátis",
    "main_page": "Início",
    "search": "Buscar qualquer coisa...",
    "search_in_category": "Buscar em {category}",
    "find": "Buscar",
    "place_ad": "Publicar Anúncio",
    "account": "Minha Conta",
    "categories": "Todas as Categorias",
    "sign_in": "Entrar"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <NuxtLink
      :to="indexRoute"
      :aria-label="t('main_page')"
      :class="$style.logo"
    >
      <NuxtImg
        :alt="t('title')"
        src="/icon-logo.svg"
        width="120px"
        height="44px"
      />
    </NuxtLink>

    <button
      :class="$style.categoriesButton"
      type="button"
      @click="toggleCategory"
    >
      <IconClose
        v-if="isCategoryOpen"
        :class="$style.categoriesIcon"
      />

      <IconHamburger
        v-else
        :class="$style.categoriesIcon"
      />

      <span v-text="t('categories')" />
    </button>

    <div :class="$style.findWrap">
      <UIInput
        v-model="searchString"
        :class="$style.findInput"
        :placeholder="searchPlaceholder"
        name="search"
        type="text"
        @submit="find"
      />

      <UIButton
        :text="t('find')"
        type="secondary"
        @click="find"
      />
    </div>

    <div :class="$style.adButton">
      <UIButton
        :text="t('place_ad')"
        type="tertiary"
        @click="goToCreatePage"
      />
    </div>

    <button
      v-if="isLoggedIn && currentUser"
      :class="$style.profileAvatar"
      type="button"
      @click="openMenu"
    >
      <UIAvatar
        :size="44"
        :img="currentUser.photoURL"
        :name="currentUser.name"
      />
    </button>

    <UIButton
      v-else
      :text="t('sign_in')"
      type="secondary"
      @click="showAuthModal"
    />

    <transition name="fade">
      <LazyHeaderDesktopCategories
        v-if="isCategoryOpen"
        :class="$style.categories"
        @close="toggleCategory"
      />
    </transition>

    <transition name="fade">
      <div
        v-if="isMenuOpen"
        v-click-outside="closeMenu"
        :class="$style.menu"
      >
        <LazyHeaderMenu @close="closeMenu" />
      </div>
    </transition>

    <LazyAuthModal
      v-if="isAuthModalVisible"
      @close="hideAuthModal"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
}

.logo {
  width: 120px;
  height: 44px;
  margin-right: 20px;
}

.categoriesButton {
  @include ui-button-primary;

  height: 44px;
  margin-right: 10px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.categoriesIcon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.findWrap {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  margin-right: 10px;
}

.findInput {
  margin-right: 4px;
}

.adButton {
  margin-right: 10px;
  white-space: nowrap;
}

.profileAvatar {
  @include ui-button;

  height: 44px;
  padding: 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.categories {
  position: absolute;
  top: 70px;
  left: 20px;
  z-index: $z-idx-dropdown;
}

.menu {
  @include ui-round-ui-elements;

  position: absolute;
  top: 70px;
  right: 20px;
  z-index: $z-idx-dropdown;

  width: 300px;
  border: 1px solid $ui-color-transparent;
  box-shadow: $box-shadow;
}
</style>
