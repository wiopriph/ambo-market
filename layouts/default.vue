<template>
  <div :class="$style.page">
    <slot />

    <Footer />
  </div>
</template>

<style lang="scss" module>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
