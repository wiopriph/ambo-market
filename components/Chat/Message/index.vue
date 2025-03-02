<script setup lang="ts">
import type { MessageProps } from './types';
import IconCheck from '~/assets/images/chat/icon-check.svg?component';
import IconError from 'assets/images/chat/icon-error.svg?component';
import { formatLocalizedDate } from '~/utils/formatDate';


const props = withDefaults(defineProps<MessageProps>(), {
  isRead: false,
  isSending: false,
  isFailed: false,
  isMine: false,
  date: 0,
  message: '',
});

const { locale } = useI18n();

const formattedDate = computed(() => formatLocalizedDate(props.date, locale.value));


const emit = defineEmits(['resend']);

const resend = () => {
  emit('resend');
};


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

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "error": "Message not sent!",
    "resend": "Resend"
  },
  "pt": {
    "error": "Mensagem não enviada!",
    "resend": "Reenviar"
  }
}
</i18n>

<template>
  <div :class="classNames">
    <div :class="$style.message">
      <div :class="$style.info">
        <span
          :class="$style.date"
          v-text="formattedDate"
        />

        <IconCheck
          v-show="!isSending"
          :class="checkClassNames"
        />
      </div>

      <div :class="$style.content">
        <p
          :class="$style.text"
          v-text="props.message"
        />
      </div>

      <div
        v-if="isFailed"
        :class="$style.error"
      >
        <IconError :class="$style.errorIcon" />

        <p
          :class="$style.errorText"
          v-text="t('error')"
        />

        <button
          :class="$style.errorButton"
          type="button"
          @click="resend"
        >
          {{ t('resend') }}
        </button>
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
    flex-direction: row-reverse;
  }
}

.check {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  margin-right: 4px;
}

.read {
  color: $ui-color-blue;
}

.unread {
  color: $ui-color-transparent;
}

.date {
  @include ui-typo-10;
  line-height: 18px;
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

.error {
  @include ui-typo-12;
  display: flex;
  align-items: center;

  .sender & {
    margin-left: auto;
  }
}

.errorIcon {
  width: 12px;
  height: 12px;
  color: $ui-color-system-red
}

.errorText {
  margin-left: 4px;
  margin-right: 4px;
  color: $ui-color-system-red
}

.errorButton {
  @include ui-button-link-view;
  @include ui-typo-12;
}
</style>
