<script setup lang="ts">
import type { Props } from './types';
import IconActive from '~/assets/images/progress/icon-active.svg?component';


const props = defineProps<Props>();
</script>

<template>
  <ul :class="$style.root">
    <li
      v-for="(item, index) in props.list"
      :key="index"
    >
      <div :class="$style.item">
        <div
          v-if="item.active"
          :class="$style.iconWrap"
        >
          <IconActive :class="$style.icon" />
        </div>

        <div
          v-else
          :class="$style.unIcon"
        />

        <div v-text="item.label" />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" module>
$icon-size: 20px;

.root {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li:not(:last-child) {

  .item::after {
    position: absolute;
    top: 6px;
    left: 31px;
    z-index: -1;
    width: 1px;
    height: 100%;
    background-color: rgb(235, 235, 235);
    content: "";
  }
}

.item {
  position: relative;
  z-index: 2;
  padding-bottom: 20px;
  padding-left: 64px;
  line-height: normal;
}

.iconWrap {
  position: absolute;
  top: -4px;
  left: -3px;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 6px 27px 0;
  vertical-align: top;
  border-radius: 10px;
}

.icon {
  width: 100%;
  height: 100%;
}

.unIcon {
  position: absolute;
  top: -2px;
  left: 0;
  display: inline-block;
  width: 9px;
  height: 9px;
  margin: 6px 27px 0;
  vertical-align: top;
  background-color: rgb(235, 235, 235);
  border-radius: 10px;
}
</style>
