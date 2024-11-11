<script setup lang="ts">
import type { ChatPreviewProps } from './types';
import formatLocalizedDate from '~/utils/formatLocalizedDate';


const props = withDefaults(defineProps<ChatPreviewProps>(), {
  isActive: false,
  unreadCount: 0,
});


const style = useCssModule();

const classNames = computed(() => ({
  [style.root]: true,
  [style.active]: props.isActive,
}));


const userName = computed(() => props.user?.name || `User_${props.user.id.slice(0, 4)}`);


const { locale } = useI18n();

const lastMessage = computed(() => {
  if (props.message?.id) {
    return {
      date: formatLocalizedDate(props.message.timestamp, locale.value),
      text: props.message.text,
    };
  }

  return null;
});
</script>

<template>
  <div :class="classNames">
    <div :class="$style.photo">
      <UIImage
        :size="32"
        :img="product.image"
        :name="product.title"
        :class="$style.productPhoto"
      />

      <div :class="$style.userPhoto">
        <UIAvatar
          :size="32"
          :img="user.photoUrl"
          :name="userName"
          :class="$style.userAvatar"
        />
      </div>
    </div>

    <div :class="$style.info">
      <span
        :class="$style.userName"
        v-text="userName"
      />

      <span
        :class="$style.productName"
        v-text="product.title"
      />

      <template v-if="lastMessage">
        <span
          :class="$style.date"
          v-text="lastMessage.date"
        />

        <div :class="$style.messageWrap">
          <span
            :class="$style.message"
            v-text="lastMessage.text"
          />

          <span
            v-if="unreadCount"
            :class="$style.counter"
            v-text="unreadCount"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  padding: 10px;
  color: $ui-color-black;
  background-color: $ui-color-white;
  cursor: pointer;
}

.active {
  color: $ui-color-white;
  background-color: $ui-color-blue;
  cursor: default;
}

.photo {
  position: relative;
  display: block;
  width: 70px;
  min-width: 70px;
  height: 80px;
  margin-right: 30px;
}

.productPhoto {
  @include ui-round-ui-elements;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  background-color: #FAFAFA;
}

.userPhoto {
  position: absolute;
  top: 0;
  right: -16px;
}

.userAvatar {
  background-color: $ui-color-white;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.userName {
  @include ui-typo-14-bold;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.productName {
  @include ui-typo-14;

  margin-top: 4px;
}

.date {
  @include ui-typo-10;

  margin-top: auto;
  color: $ui-color-text-main;

  .active & {
    color: $ui-color-white;
  }
}

.messageWrap {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message {
  @include ui-typo-12;
  display: inline-block;
  flex: 1;
  max-width: 100%;
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.counter {
  @include ui-typo-8;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  height: 16px;
  margin-left: 8px;
  color: $ui-color-white;
  background-color: $ui-color-blue;
  border-radius: 50%;

  .active & {
    color: $ui-color-blue;
    background-color: $ui-color-white;
  }
}
</style>
