<template>
  <div :class="$style.root">
    <UILoader />
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  height: 100%;
  padding: 24px 20px;
}
</style>
