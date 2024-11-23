<script setup lang="ts">
import type { StatusProps } from './types';
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<StatusProps>();

const { t } = useI18n();

const isValidStatus = computed(() => Object.values(POST_STATUSES).includes(props.status));

const style = useCssModule();
const rootClassNames = computed(() => ({
  [style.root]: true,
  [style[props.status]]: isValidStatus.value,
}));
</script>

<i18n>
{
  "en": {
    "open": "Published",
    "hold": "Reserved",
    "closed": "Sold",
    "blocked": "Blocked"
  },
  "pt": {
    "open": "Abrir",
    "hold": "Reservado",
    "closed": "Fechado",
    "blocked": "Bloqueado"
  }
}
</i18n>

<template>
  <span
    v-show="isValidStatus"
    :class="rootClassNames"
    v-text="t(status)"
  />
</template>

<style lang="scss" module>
.root {
  @include ui-typo-10;
  @include ui-round-ui-elements;

  display: inline-block;
  padding: 4px 8px;
  overflow: hidden;
  color: $ui-color-white;
  white-space: nowrap;
  text-transform: uppercase;
  text-overflow: ellipsis;
}

.open {
  background-color: $ui-color-add;
}

.hold {
  background-color: $ui-color-blue;
}

.closed {
  background-color: $ui-color-add;
}

.blocked {
  background-color: $ui-color-system-red;
}
</style>
