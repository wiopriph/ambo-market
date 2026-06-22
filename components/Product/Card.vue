<script setup lang="ts">
import type { Post } from '~/composables/usePosts/types';
import formatCurrency from '~/utils/formatCurrency';
import { POST_STATUSES } from '~/constants/post-statuses';
import { getPostRoute } from '~/utils/getPostRoute';
import { CLICK_PRODUCT_CARD } from '~/constants/analytics-events';


interface CardProps {
  product: Post;
}


const props = defineProps<CardProps>();

const formattedPrice = computed(() => formatCurrency(props.product?.price));
const city = computed(() => props.product?.location?.cityName || '');
const previewImage = computed(() => props.product?.preview || '');
const productTitle = computed(() => props.product?.title || ' ');

const hasStatus = computed(() => props.product?.status !== POST_STATUSES.OPEN);

const statusColor = computed(() => {
  const map: Record<string, 'success' | 'info' | 'error'> = {
    [POST_STATUSES.HOLD]: 'info',
    [POST_STATUSES.CLOSED]: 'success',
  };

  return map[props.product?.status] ?? 'error';
});

const link = computed(() => getPostRoute({
  cityId: props.product?.location?.cityId ?? 'all',
  categoryId: props.product?.categoryId,
  subcategoryId: props.product?.subcategoryId,
  brandId: props.product?.brandId,
  productId: props.product?.id,
}));

const { pushEvent } = useAnalyticsEvent();
const { t } = useI18n();
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
  <NuxtLink
    :to="link"
    class="flex flex-col h-full overflow-hidden rounded-xl bg-white shadow transition-shadow duration-200 hover:shadow-md text-inherit no-underline"
    rel="noopener noreferrer"
    @click="pushEvent(CLICK_PRODUCT_CARD, { product_id: props.product?.id })"
  >
    <div class="relative w-full aspect-square">
      <UBadge
        v-if="hasStatus"
        :color="statusColor"
        variant="subtle"
        class="absolute top-2.5 left-2.5 z-10"
        v-text="t(product.status)"
      />

      <span
        v-if="city"
        class="absolute bottom-2.5 left-2.5 z-10 rounded-md px-1.5 py-0.5 text-xs text-white bg-black/50 backdrop-blur-sm truncate max-w-[calc(100%-20px)]"
        v-text="city"
      />

      <NuxtImg
        :src="previewImage"
        :alt="productTitle"
        :preload="{ fetchPriority: 'high' }"
        fetchPriority="high"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>

    <div class="p-2.5">
      <div
        class="font-semibold text-base leading-6 truncate"
        v-text="formattedPrice"
      />

      <div
        class="text-sm mt-0.5 truncate text-gray-700"
        v-text="productTitle"
      />
    </div>
  </NuxtLink>
</template>
