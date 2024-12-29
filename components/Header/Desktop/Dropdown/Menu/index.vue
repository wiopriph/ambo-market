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

<template>
  <div
    v-click-outside="close"
    :class="$style.root"
  >
    <ul :class="$style.navList">
      <li
        v-for="(item, index) in props.list"
        :key="index"
      >
        <NuxtLink
          :to="item.route"
          :class="$style.navItem"
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
      <IconLogout :class="$style.logoutIcon" />

      <span v-text="t('logout')" />
    </button>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-ui-elements;
  @include ui-typo-15;
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;
  box-shadow: $box-shadow;
}

.navList {
  flex: 1;
  padding: 10px 0;
}

.navItem {
  @include ui-button;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  color: $ui-color-black;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: $ui-color-blue-light;
  }
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  transition: color .2s linear, fill .2s linear;

  .navItem:hover & {
    color: $ui-color-blue-light;
  }
}

.logoutIcon {
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
  padding: 16px;
  background-color: #FAFAFA;
  border-radius: 0 0 4px 4px;

  &:hover {
    color: $ui-color-blue-light;
  }
}
</style>
