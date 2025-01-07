<script setup lang="ts">
import IconAds from '~/assets/images/header/icon-ads.svg?component';
import IconMail from '~/assets/images/header/icon-mail.svg?component';
import IconHeart from '~/assets/images/header/icon-heart.svg?component';
import IconDeals from '~/assets/images/header/icon-deals.svg?component';
import IconSettings from '~/assets/images/header/icon-settings.svg?component';
import { useUser } from '~/composables/useUser';


const { uid } = useUser();

const { t } = useI18n();

const menuList = computed(() => [
  {
    icon: IconAds,
    label: t('ads'),
    route: {
      name: 'user-userUid-status',
      params: {
        userUid: uid.value,
      },
    },
  },
  {
    icon: IconMail,
    label: t('messages'),
    route: { name: 'im' },
  },
  {
    icon: IconHeart,
    label: t('favorites'),
    route: {
      name: 'user-userUid-favorites',
      params: {
        userUid: uid.value,
      },
    },
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
  },
  {
    icon: IconSettings,
    label: t('settings'),
    route: {
      name: 'user-userUid-settings',
      params: {
        userUid: uid.value,
      },
    },
  },
]);
</script>

<i18n>
{
  "en": {
    "messages": "My messages",
    "favorites": "Favorites",
    "orders": "My orders",
    "ads": "My ads",
    "settings": "Settings"
  },
  "pt": {
    "messages": "Minhas mensagens",
    "favorites": "Favoritos",
    "orders": "Minhas ordens",
    "ads": "Meus anúncios",
    "settings": "Configurações"
  }
}
</i18n>

<template>
  <ul :class="$style.root">
    <li
      v-for="(item, index) in menuList"
      :key="index"
    >
      <NuxtLink
        :to="item.route"
        :class="$style.link"
        :activeClass="$style.activeLink"
        exact
      >
        <component
          :is="item.icon"
          :class="$style.icon"
        />

        <span v-text="item.label" />
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" module>
.root {
  @include ui-typo-15;

  display: flex;
  flex-direction: column;
  width: 100%;
}

.link {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 10px;
  color: $ui-color-black;
  text-decoration: none;
  user-select: none;

  &:hover {
    color: $ui-color-blue-light;
  }
}

.activeLink {
  color: $ui-color-blue;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  transition: color .2s linear;

  .activeLink & {
    color: $ui-color-blue;
  }

  .link:hover & {
    color: $ui-color-blue-light;
  }

  .link:active & {
    color: $ui-color-white;
  }
}
</style>
