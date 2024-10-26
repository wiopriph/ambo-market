<template>
  <div :class="$style.root" />
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;
  padding: 20px;

  h1 {
    @include ui-typo-36-medium;
  }

  h3 {
    @include ui-typo-24-medium;
    margin-top: 36px;
  }

  p {
    margin-top: 24px;
  }
}
</style>
