<script setup lang="ts">
import IconLogout from '~/assets/images/header/icon-logout.svg?component';
import type { MenuItem } from '~/components/Header/types';


const menuList = inject<ComputedRef<MenuItem[]>>('menuList');


const emit = defineEmits(['close']);

const close = () => emit('close');


const { pushEvent } = useAnalyticsEvent();

const menuClick = (event: string) => {
  pushEvent(event);
  close();
};

const { signOut } = useAuth();

const logout = async () => {
  try {
    await navigateTo({ name: 'auth' });

    await signOut();

    close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "logout": "Logout"
  },
  "pt": {
    "logout": "Sair"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <ul
      v-if="menuList"
      :class="$style.list"
    >
      <li
        v-for="(item, index) in menuList"
        :key="index"
      >
        <NuxtLink
          :to="item.route"
          :class="$style.item"
          @click="menuClick(item.event)"
        >
          <component
            :is="item.icon"
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
  transition: color .2s linear, fill .2s linear;

  .item:hover & {
    color: $ui-color-blue-light;
  }
}

.logoutButton {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #FAFAFA;
  border-radius: 0 0 4px 4px;

  &:hover {
    color: $ui-color-blue-light;
  }
}
</style>
