<template>
  <div :class="$style.root">
    <div :class="$style.photoWrap">
      <span :class="$style.address" />

      <div :class="$style.photo" />
    </div>

    <div :class="$style.info">
      <div :class="$style.favorite">
        <div :class="$style.price" />

        <div :class="$style.heart" />
      </div>

      <div :class="$style.name" />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
  transition: box-shadow 0.2s linear;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent 0%, #ffffff 15%, transparent 30%);
    animation: placeholdersAnimation 1.5s linear infinite;
    content: '';
  }
}

.photoWrap {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $ui-color-transparent;
}

$card-indent: 10px;

.address {
  @include ui-round-ui-elements;
  position: absolute;
  bottom: $card-indent;
  left: $card-indent;
  z-index: 1;
  width: 75px;
  max-width: calc(100% - #{$card-indent * 2});
  height: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
}

.info {
  padding: 10px;
}

.favorite {
  display: flex;
  justify-content: space-between;
}

.price,
.heart,
.name {
  @include ui-round-ui-elements;
  background-color: $ui-color-transparent;
}

.price {
  width: 55px;
  height: 20px;
}

.heart {
  width: 20px;
  height: 20px;
}

.name {
  width: 80%;
  height: 18px;
  margin-top: 8px;
}

@keyframes placeholdersAnimation {
  0% {
    transform: translateX(-30%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
