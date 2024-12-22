<script setup lang="ts">
import IconLocation from '~/assets/images/header/icon-location.svg?component';
// import IconDeals from '~/assets/images/header/icon-deals.svg?component';
import IconMail from '~/assets/images/header/icon-mail.svg?component';
import IconHeart from '~/assets/images/header/icon-heart.svg?component';
import IconAds from '~/assets/images/header/icon-ads.svg?component';
import { getLabelByRadius } from '~/constants/distance';
import { usePosts } from '~/composables/usePosts';


const { t } = useI18n();

const links = computed(() => [
  // {
  //   icon: IconDeals,
  //   text: t('orders'),
  //   to: {
  //     name: 'order-history-status',
  //     params: {
  //       status: 'buy',
  //     },
  //   },
  // },
  {
    icon: IconHeart,
    text: t('favorites'),
    to: { name: 'user-favorites' },
  },
  {
    icon: IconMail,
    text: t('messages'),
    to: { name: 'im' },
  },
  {
    icon: IconAds,
    text: t('ads'),
    to: { name: 'user-ads' },
  },
]);


const { coords, locationName } = usePosts();

const hasRadius = computed(() => locationName.value && coords.value.radius);
const selectedRadiusLabel = computed(() => getLabelByRadius(`${coords.value?.radius || ''}`));
const locationNameOrDefault = computed(() => locationName.value || t('everywhere'));


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
    "location": "Location:",
    "everywhere": "Everywhere",
    "messages": "Chats",
    "favorites": "Favorites",
    "ads": "My ads",
    "orders": "My orders"
  },
  "pt": {
    "location": "Localização:",
    "everywhere": "Em todos os lugares",
    "messages": "Minhas mensagens",
    "favorites": "Favoritos",
    "ads": "Meus anúncios",
    "orders": "Minhas ordens"
  }
}
</i18n>

<template>
  <nav :class="$style.root">
    <div :class="$style.location">
      <span
        :class="$style.locationText"
        v-text="t('location')"
      />

      <button
        :class="$style.locationButton"
        type="button"
        @click="showMapModal"
      >
        <IconLocation :class="$style.icon" />

        <span
          :class="$style.text"
          v-text="locationNameOrDefault"
        />

        <span
          v-if="hasRadius"
          :class="$style.radius"
        >, +{{ selectedRadiusLabel }}</span>
      </button>
    </div>

    <transition name="fade">
      <LazyGeolocationModal
        v-if="isMapModalVisible"
        @close="hideMapModal"
      />
    </transition>

    <ul :class="$style.links">
      <li
        v-for="link in links"
        :key="link.text"
        :class="$style.item"
      >
        <NuxtLink
          :to="link.to"
          :class="$style.link"
        >
          <component
            :is="link.icon"
            :class="$style.icon"
          />

          <span
            :class="$style.text"
            v-text="link.text"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" module>
.root {
  @include ui-typo-14;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 20px;
}

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.locationText {
  margin-right: 8px;
  color: $ui-color-text-main;

  @include sm {
    display: none;
  }
}

.locationButton {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 250px;
  padding: 0;
  color: $ui-color-black;

  @include sm {
    max-width: 180px;
  }

  &:hover {
    color: $ui-color-blue-light;
  }
}

.icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.text {
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: underline;
  text-overflow: ellipsis;
}

.radius {
  white-space: nowrap;
}

.links {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item {
  cursor: pointer;

  & + & {
    margin-left: 20px;
  }
}

.link {
  display: flex;
  align-items: center;
  color: $ui-color-black;
  transition: color .2s linear;

  &:hover {
    color: $ui-color-blue-light;
  }

  &:active {
    color: $ui-color-black;
  }

  @include sm {

    .text {
      display: none;
    }
  }
}
</style>
