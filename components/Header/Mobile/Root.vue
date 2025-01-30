<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router';
import IconLogo from '~/assets/images/icon-logo.svg?component';
import IconHamburger from '~/assets/images/header/icon-hamburger.svg?component';
import IconProfile from '~/assets/images/header/icon-profile.svg?component';
import { useUser } from '~/composables/useUser';


const indexRoute = inject<RouteLocationRaw>('indexRoute');


const isAuthModalVisible = ref(false);

const showAuthModal = () => {
  isAuthModalVisible.value = true;
};

const hideAuthModal = () => {
  isAuthModalVisible.value = false;
};


const isCategoryModalVisible = ref(false);

const showCategoryModal = () => {
  isCategoryModalVisible.value = true;
};

const hideCategoryModal = () => {
  isCategoryModalVisible.value = false;
};


const isMenuModalVisible = ref(false);

const showMenuModal = () => {
  isMenuModalVisible.value = true;
};

const hideMenuModal = () => {
  isMenuModalVisible.value = false;
};


const isMapModalVisible = ref(false);

const showMapModal = () => {
  isMapModalVisible.value = true;
};

const hideMapModal = () => {
  isMapModalVisible.value = false;
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
    "main_page": "Main page",
    "account": "Account",
    "categories": "Categories"
  },
  "pt": {
    "main_page": "Página principal",
    "account": "Conta",
    "categories": "Categorias"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <button
      :class="$style.button"
      :aria-label="t('categories')"
      type="button"
      @click="showCategoryModal"
    >
      <IconHamburger />
    </button>

    <NuxtLink
      :to="indexRoute"
      :aria-label="t('main_page')"
      :class="$style.logo"
    >
      <IconLogo :class="$style.logo" />
    </NuxtLink>

    <button
      v-if="isLoggedIn && currentUser"
      :class="$style.button"
      :aria-label="t('account')"
      type="button"
      @click="showMenuModal"
    >
      <UIAvatar
        :size="24"
        :img="currentUser.photoURL"
        :name="currentUser.name"
      />
    </button>

    <button
      v-else
      :class="$style.button"
      :aria-label="t('account')"
      type="button"
      @click="showAuthModal"
    >
      <IconProfile />
    </button>

    <LazyGeolocationModal
      v-if="isMapModalVisible"
      @close="hideMapModal"
    />

    <LazyAuthModal
      v-if="isAuthModalVisible"
      @close="hideAuthModal"
    />

    <LazyUIModal
      v-if="isCategoryModalVisible"
      :title="t('categories')"
      @close="hideCategoryModal"
    >
      <LazyHeaderMobileLocation @click="showMapModal" />

      <LazyHeaderMobileCategories
        :class="$style.categories"
        @close="hideCategoryModal"
      />
    </LazyUIModal>

    <LazyUIModal
      v-if="isMenuModalVisible"
      :title="t('account')"
      @close="hideMenuModal"
    >
      <LazyHeaderMenu
        :class="$style.menu"
        @close="hideMenuModal"
      />
    </LazyUIModal>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.button {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
}

.logo {
  height: 24px;
}

.categories {
  height: calc(100% - 88px);
}

.menu {
  width: 100%;
  height: calc(100% - 44px);
}
</style>
