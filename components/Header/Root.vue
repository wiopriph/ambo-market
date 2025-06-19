<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import IconMail from '~/assets/images/header/icon-mail.svg?component';
import IconHeart from '~/assets/images/header/icon-heart.svg?component';
import IconDeals from '~/assets/images/header/icon-deals.svg?component';
import IconAds from '~/assets/images/header/icon-ads.svg?component';
import IconSettings from '~/assets/images/header/icon-settings.svg?component';
import { CATEGORIES } from '~/constants/categories';
import {
  CLICK_CHATS_BUTTON,
  CLICK_FAVORITES_BUTTON,
  CLICK_MY_ADS_BUTTON,
  CLICK_ORDERS_BUTTON,
  CLICK_SETTINGS_BUTTON,
} from '~/constants/analytics-events';


const { t } = useI18n();

const menuList = computed(() => [
  {
    icon: IconAds,
    label: t('ads'),
    route: { name: 'user-ads' },
    event: CLICK_MY_ADS_BUTTON,
  },
  {
    icon: IconMail,
    label: t('messages'),
    route: { name: 'im' },
    event: CLICK_CHATS_BUTTON,
  },
  {
    icon: IconHeart,
    label: t('favorites'),
    route: { name: 'user-favorites' },
    event: CLICK_FAVORITES_BUTTON,
  },
  {
    icon: IconDeals,
    label: t('orders'),
    route: {
      name: 'order-history-status',
      params: {
        status: 'buy',
      },
    },
    event: CLICK_ORDERS_BUTTON,
  },
  {
    icon: IconSettings,
    label: t('settings'),
    route: { name: 'user-settings' },
    event: CLICK_SETTINGS_BUTTON,
  },
]);


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

const categoryList = computed(() => CATEGORIES.map(category => ({
  title: t(category.key),
  img: category.img,
  route: {
    name: 'cityId-categoryId',
    params: {
      categoryId: category.id,
      cityId: cityId.value,
    },
  },
})));


provide('menuList', menuList);
provide('indexRoute', indexRoute);
provide('categoryList', categoryList);


const ROUTES_WITH_SEARCH_FORM = [
  'index',
  'cityId',
  'cityId-categoryId',
  'cityId-categoryId-subcategoryId',
  'cityId-categoryId-subcategoryId-brandId',
  'privacy',
];

const route = useRoute();

const hasFinder = computed(() => ROUTES_WITH_SEARCH_FORM.includes(route.name as string));


const hasNavbar = ref(true);
const lastScrollPosition = ref(0);
const currentScrollPosition = ref(0);

const { hasActiveFilters } = usePosts();


const style = useCssModule();

const mobileWrapClassNames = computed(() => ({
  [style.mobileWrap]: true,
  [style.small]: !hasFinder.value,
  [style.medium]: hasFinder.value && !hasActiveFilters.value,
  [style.big]: hasFinder.value && hasActiveFilters.value,
}));

const mobileClassNames = computed(() => ({
  [style.mobile]: true,
  [style.unpinned]: !hasNavbar.value,
  [style.pinned]: !!currentScrollPosition.value && hasNavbar.value,
}));

const desktopClassNames = computed(() => ({
  [style.desktop]: true,
  [style.pinned]: currentScrollPosition.value >= 44,
}));


const onScroll = () => {
  currentScrollPosition.value = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition.value < 0) {
    return;
  }

  if (Math.abs(currentScrollPosition.value - lastScrollPosition.value) < 108) {
    return;
  }

  hasNavbar.value = currentScrollPosition.value < lastScrollPosition.value;
  lastScrollPosition.value = currentScrollPosition.value;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

const { isDesktopOrTablet } = useDevice();
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Main page",
    "messages": "My messages",
    "favorites": "Favorites",
    "orders": "My orders",
    "ads": "My ads",
    "settings": "Settings"
  },
  "pt": {
    "main_page": "Página inicial",
    "messages": "Minhas mensagens",
    "favorites": "Favoritos",
    "orders": "Minhas ordens",
    "ads": "Meus anúncios",
    "settings": "Configurações"
  }
}
</i18n>

<template>
  <div
    v-if="isDesktopOrTablet"
    :class="$style.desktopWrap"
  >
    <header :class="desktopClassNames">
      <div :class="$style.wrap">
        <HeaderDesktopNavigation :class="$style.container" />
      </div>

      <HeaderDesktopRoot :class="$style.container" />
    </header>
  </div>

  <div
    v-else
    :class="mobileWrapClassNames"
  >
    <header :class="mobileClassNames">
      <HeaderMobileRoot />

      <HeaderMobileFinder v-if="hasFinder" />
    </header>
  </div>
</template>

<style lang="scss" module>
.mobileWrap {
  width: 100%;
}

.small {
  min-height: 44px;
}

.medium {
  min-height: 108px;
}

.big {
  min-height: 136px;
}

.desktopWrap {
  width: 100%;
  min-height: 108px;
}

.desktop {
  position: fixed;
  top: 0;
  z-index: $z-idx-popup;
  width: 100%;
  height: 108px;
  margin: 0 auto;
  background-color: #FAFAFA;
  transition: .2s transform linear, .2s box-shadow linear;
}

.container {
  @include ui-simple-container;
}

.wrap {
  background-color: #FAFAFA;
}

.mobile {
  position: fixed;
  top: 0;
  z-index: $z-idx-popup;
  width: 100%;
  background-color: #FAFAFA;
  transition: .2s transform linear, .2s background-color linear, .2s box-shadow linear;
}

.pinned {
  box-shadow: $box-shadow;

  @include exclude-md {
    background-color: $ui-color-white;
    transform: translateY(-44px);
  }
}

.unpinned {
  transform: translateY(-100%);
}
</style>
