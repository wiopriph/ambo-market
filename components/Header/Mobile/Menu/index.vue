<script setup lang="ts">
import type { DropdownMenuProps } from './types';
import IconAddUser from '~/assets/images/header/icon-add-user.svg?component';
import IconMail from '~/assets/images/header/icon-mail.svg?component';
import IconHeart from '~/assets/images/header/icon-heart.svg?component';
import IconDeals from '~/assets/images/header/icon-deals.svg?component';
import IconAds from '~/assets/images/header/icon-ads.svg?component';
import IconSettings from '~/assets/images/header/icon-settings.svg?component';
import IconLogout from '~/assets/images/header/icon-logout.svg?component';


const componentsMap = {
  IconAddUser,
  IconMail,
  IconHeart,
  IconDeals,
  IconAds,
  IconSettings,
  IconLogout,
};

const props = defineProps<DropdownMenuProps>();


const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};


const { $fire } = useNuxtApp();

const logout = async () => {
  try {
    await navigateTo({ name: 'auth' });

    await $fire.auth.signOut();

    close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "add_account": "Add account",
    "logout": "Logout"
  },
  "pt": {
    "add_account": "Adicionar conta",
    "logout": "Sair"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <ul :class="$style.list">
      <li
        v-for="(item, index) in props.list"
        :key="index"
      >
        <NuxtLink
          :to="item.route"
          :class="$style.item"
          @click="close"
        >
          <component
            :is="componentsMap[item.icon]"
            :class="$style.icon"
          />

          <span v-text="item.label" />
        </NuxtLink>
      </li>
    </ul>

    <button
      :class="$style.logoutButton"
      type="button"
      @click="logout"
    >
      <IconLogout :class="$style.icon" />

      <span v-text="t('logout')" />
    </button>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 44px);
  background-color: $ui-color-white;
}

.list {
  flex: 1;
  padding: 10px 0;
}

.item {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 10px 20px;
  color: $ui-color-black;
  text-decoration: none;
  background-color: $ui-color-white;
  user-select: none;

  &:hover {
    color: $ui-color-blue-light;
  }
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.logoutButton {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #FAFAFA;

  &:hover {
    color: $ui-color-blue-light;
  }
}
</style>
