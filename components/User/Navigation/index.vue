<script setup lang="ts">
import type { UserNavigationProps } from './types';


const props = defineProps<UserNavigationProps>();


const style = useCssModule();

const getClass = (name: string, isActive: boolean) => ({
  [style[name]]: true,
  [style[`${name}Active`]]: isActive,
});
</script>

<template>
  <nav :class="$style.root">
    <ul :class="$style.menu">
      <NuxtLink
        v-for="item in props.list"
        v-slot="{ href, isExactActive, navigate }"
        :key="item.text"
        :to="item.route"
        custom
      >
        <li :class="getClass('item', isExactActive)">
          <a
            :href="href"
            :class="getClass('link', isExactActive)"
            @click="navigate"
          >{{ item.text }}</a>
        </li>
      </NuxtLink>
    </ul>
  </nav>
</template>

<style lang="scss" module>
.root {
  border-bottom: 1px solid $ui-color-transparent;
}

.menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.item {
  margin-bottom: -1px; // фикс border-top
  border-bottom: 1px solid $ui-color-transparent;

  & + & {
    margin-left: 20px;
  }
}

.itemActive {
  border-bottom: 1px solid $ui-color-blue;
}

.link {
  @include ui-typo-15;

  display: block;
  margin-bottom: 7px;
  color: $ui-color-text-main;
  text-decoration: none;
}

.linkActive {
  color: $ui-color-black;
}
</style>
