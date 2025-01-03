<template>
  <div :class="$style.root">
    <UILoader />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  color: $ui-color-black;
}

.header {
  flex-shrink: 0;
  padding: 10px;
  border-bottom: 1px solid $ui-color-transparent;
}

.mobileTop {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.messages {
  flex-grow: 1;
  padding: 10px;
  overflow: auto;
}

.list {
  //padding: 20px 0;
}

.message {

  & + & {
    margin-top: 4px;
  }
}

.footer {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  padding: 10px;
}

.sendButton {
  flex-shrink: 0;
  width: 70px;
  margin-left: 10px;
  padding: 12px 10px;
}
</style>
