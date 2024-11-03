<template>
  <div :class="$style.root">
    <div :class="$style.loader" />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loader {
  width: 64px;
  height: 64px;
  border: 4px solid $ui-color-transparent;
  border-top: 4px solid $ui-color-blue;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {

  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

}
</style>
