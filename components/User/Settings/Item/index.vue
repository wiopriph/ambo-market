<script setup lang="ts">
import type { UserSettingsItemProps } from './types';


const props = withDefaults(defineProps<UserSettingsItemProps>(), {
  isFilled: false,
  disabled: false,
  title: '',
  placeholder: '',
  setButtonText: '',
  editButtonText: '',
});


const { t } = useI18n();

const buttonText = computed(() => {
  if (props.isFilled) {
    return props.editButtonText || t('edit');
  }

  return props.setButtonText || t('set');
});


const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<i18n>
{
  "en": {
    "set": "Set",
    "edit": "Edit"
  },
  "pt": {
    "set": "Definir",
    "edit": "Editar"
  }
}
</i18n>

<template>
  <div
    :class="$style.root"
    @click.prevent="handleClick"
  >
    <div :class="$style.line">
      <div :class="$style.heading">
        <span
          :class="$style.title"
          v-text="title"
        />
      </div>

      <div :class="$style.content">
        <slot v-if="isFilled" />

        <span
          v-else
          v-text="placeholder"
        />
      </div>
    </div>

    <div :class="$style.controls">
      <button
        v-if="!disabled"
        :class="$style.button"
        type="button"
        v-text="buttonText"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 13px 0;
  color: $ui-color-black;
  cursor: pointer;

  @include exclude-md {
    align-items: center;
  }
}

.line {
  display: flex;
  flex: 1;
  flex-direction: row;

  @include exclude-md {
    align-items: center;
  }

  @include md {
    flex-direction: column;
  }
}

$heading-width: 300px;

.heading {

  @include exclude-md {
    width: $heading-width;
  }
}

.title {
  color: $ui-color-text-main;
}

.content {

  @include md {
    margin-top: 10px;
  }

  @include exclude-md {
    width: calc(100% - $heading-width);
  }
}

.controls {
  margin-left: 20px;
}

.button {
  @include ui-button;

  padding: 0;
  color: $ui-color-blue;
}
</style>
