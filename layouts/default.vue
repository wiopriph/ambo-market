<template>
  <div :class="$style.page">
    <slot />

    <Footer />
  </div>
</template>

<style lang="scss" module>
.page {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
}
</style>
