<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';


const ROUTES_WITH_SEARCH_FORM = [
  'index',
  'cityId',
  'cityId-categoryId',
  'privacy',
];

const route = useRoute();

const hasFinder = computed(() => ROUTES_WITH_SEARCH_FORM.includes(route.name as string));


const hasNavbar = ref(true);
const lastScrollPosition = ref(0);
const currentScrollPosition = ref(0);

const { isFindActive } = usePosts();


const style = useCssModule();

const mobileWrapClassNames = computed(() => ({
  [style.mobileWrap]: true,
  [style.small]: !hasFinder.value,
  [style.medium]: hasFinder.value && !isFindActive.value,
  [style.big]: hasFinder.value && isFindActive.value,
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
