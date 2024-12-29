<script setup lang="ts">
import IconLogo from '~/assets/images/icon-logo.svg?component';
import IconHamburger from '~/assets/images/header/icon-hamburger.svg?component';
import IconProfile from '~/assets/images/header/icon-profile.svg?component';
import { usePosts } from '~/composables/usePosts';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';


const { t } = useI18n();

const menuList = computed(() => [
  {
    icon: 'IconAds',
    label: t('ads'),
    route: { name: 'user-ads' },
  },
  {
    icon: 'IconMail',
    label: t('messages'),
    route: { name: 'im' },
  },
  {
    icon: 'IconHeart',
    label: t('favorites'),
    route: { name: 'user-favorites' },
  },
  {
    icon: 'IconSettings',
    label: t('settings'),
    route: { name: 'user-settings' },
  },
]);


const {
  isLoggedIn,
  currentUser,
} = useUser();


const {
  cityId,
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

const categories = computed(() => CATEGORIES.map(category => ({
  title: t(category.type),
  img: category.img,
  route: {
    name: 'cityId-categoryId',
    params: {
      categoryId: category.type,
      cityId: cityId.value,
    },
  },
})));


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
</script>

<i18n>
{
  "en": {
    "main_page": "Main page",
    "messages": "My messages",
    "favorites": "Favorites",
    "orders": "My orders",
    "ads": "My ads",
    "settings": "Settings",
    "account": "Account",
    "categories": "Categories"
  },
  "pt": {
    "main_page": "Página principal",
    "messages": "Minhas mensagens",
    "favorites": "Favoritos",
    "orders": "Minhas ordens",
    "ads": "Meus anúncios",
    "settings": "Configurações",
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

    <transition name="fade">
      <LazyGeolocationModal
        v-if="isMapModalVisible"
        @close="hideMapModal"
      />
    </transition>

    <transition name="fade">
      <LazyAuthModal
        v-if="isAuthModalVisible"
        @close="hideAuthModal"
      />
    </transition>

    <transition name="fade">
      <LazyUIModal
        v-if="isCategoryModalVisible"
        :title="t('categories')"
        @close="hideCategoryModal"
      >
        <HeaderMobileLocation
          @click="showMapModal"
        />

        <HeaderMobileCategories
          :list="categories"
          :class="$style.categories"
          @close="hideCategoryModal"
        />
      </LazyUIModal>
    </transition>

    <transition name="fade">
      <LazyUIModal
        v-if="isMenuModalVisible"
        :title="t('account')"
        @close="hideMenuModal"
      >
        <HeaderMobileMenu
          :list="menuList"
          @close="hideMenuModal"
        />
      </LazyUIModal>
    </transition>
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
</style>
