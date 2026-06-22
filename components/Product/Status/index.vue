<script setup lang="ts">
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<{ status: string }>();

const { t } = useI18n();

const colorMap: Record<string, 'success' | 'info' | 'error'> = {
  [POST_STATUSES.HOLD]: 'info',
  [POST_STATUSES.CLOSED]: 'success',
};

const color = computed(() => colorMap[props.status] ?? 'error');
const isValidStatus = computed(() => Object.values(POST_STATUSES).includes(props.status));
</script>

<i18n lang="json">
{
  "en": {
    "open": "Published",
    "hold": "Reserved",
    "closed": "Sold"
  },
  "pt": {
    "open": "Publicado",
    "hold": "Reservado",
    "closed": "Vendido"
  }
}
</i18n>

<template>
  <UBadge
    v-if="isValidStatus"
    :color="color"
    variant="subtle"
    v-text="t(status)"
  />
</template>
