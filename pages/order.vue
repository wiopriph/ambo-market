<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: 'auth',
});

const { currentUser } = useUser();
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.left">
      <UserInfo
        v-if="currentUser"
        :user="currentUser"
      />

      <LazyUserMenu :class="$style.desktopMenu" />
    </div>

    <div :class="$style.main">
      <NuxtPage />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  display: flex;
  flex-direction: row;
  padding: 20px;
}

.left {
  max-width: 300px;
  margin-right: 20px;

  @include md {
    display: none;
  }
}

.desktopMenu {
  margin-top: 20px;

  @include md {
    display: none;
  }
}

.main {
  flex: 1;

  @include md {
    margin-top: 20px;
  }
}
</style>
