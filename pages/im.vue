<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <div :class="$style.root">
    <div>
      <NuxtPage />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 20px;
}
</style>
