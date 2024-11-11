<script setup lang="ts">
import type { MessageProps } from './types';
import IconCheck from '~/assets/images/chat/icon-check.svg?component';
import formatLocalizedDate from '~/utils/formatLocalizedDate';


const props = withDefaults(defineProps<MessageProps>(), {
  isMine: false,
  isRead: false,
  date: 0,
  message: '',
});


const style = useCssModule();

const classNames = computed(() => ({
  [style.root]: true,
  [style.sender]: props.isMine,
  [style.receiver]: !props.isMine,
}));

const checkClassNames = computed(() => ({
  [style.check]: true,
  [style.read]: props.isRead,
  [style.unread]: !props.isRead,
}));


const { locale } = useI18n();

const formattedDate = computed(() => formatLocalizedDate(props.date, locale.value));
</script>

<template>
  <div :class="classNames">
    <div :class="$style.message">
      <div :class="$style.info">
        <span
          :class="$style.date"
          v-text="formattedDate"
        />

        <IconCheck :class="checkClassNames" />
      </div>

      <div :class="$style.content">
        <p
          :class="$style.text"
          v-text="props.message"
        />
      </div>
    </div>
  </div>
</template>


<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.receiver {
  align-items: flex-start;
}

.sender {
  align-items: flex-end;
}

.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 220px;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;

  .sender & {
    margin-left: auto;
  }
}

.check {
  width: 18px;
  height: 18px;
  margin-left: 4px;
}

.read {
  color: $ui-color-blue;
}

.unread {
  color: $ui-color-transparent;
}

.date {
  @include ui-typo-10;
  color: $ui-color-black;
}

.content {
  @include ui-round-inner-blocks;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 10px;

  .receiver & {
    background-color: #FAFAFA;
  }

  .sender & {
    margin-left: auto;
    background-color: $ui-color-blue-light;
  }
}

.text {
  @include ui-typo-14;

  .receiver & {
    color: $ui-color-black;
  }

  .sender & {
    color: $ui-color-white;
  }
}
</style>
