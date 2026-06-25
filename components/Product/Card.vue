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

const STATUS_LABELS: Record<string, string> = {
  [POST_STATUSES.OPEN]: 'Publicado',
  [POST_STATUSES.HOLD]: 'Reservado',
  [POST_STATUSES.CLOSED]: 'Vendido',
};

const formattedPrice = computed(() => formatCurrency(props.product?.price));
const city = computed(() => props.product?.location?.cityName || '');
const previewImage = computed(() => props.product?.preview || '');
const productTitle = computed(() => props.product?.title || ' ');

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
</script>

<template>
  <NuxtLink
    :to="link"
    class="group flex flex-col overflow-hidden rounded-2xl border border-default bg-default transition hover:border-primary/40 hover:shadow-sm"
    rel="noopener noreferrer"
    @click="pushEvent(CLICK_PRODUCT_CARD, { product_id: props.product?.id })"
  >
    <div class="relative aspect-square overflow-hidden bg-muted">
      <UBadge
        v-if="hasStatus"
        :color="statusColor"
        class="absolute left-2.5 top-2.5 z-10"
      >
        {{ STATUS_LABELS[product.status] }}
      </UBadge>

      <span
        v-if="city"
        class="absolute bottom-2.5 left-2.5 z-10 max-w-[calc(100%-20px)] truncate rounded-md bg-black/50 px-1.5 py-0.5 text-xs text-white backdrop-blur-sm"
        v-text="city"
      />

      <img
        :src="previewImage"
        :alt="productTitle"
        class="absolute inset-0 size-full object-cover transition group-hover:scale-105"
      >
    </div>

    <div class="p-3">
      <div
        class="truncate text-sm font-bold text-highlighted"
        v-text="formattedPrice"
      />

      <div
        class="mt-0.5 truncate text-xs text-muted"
        v-text="productTitle"
      />
    </div>
  </NuxtLink>
</template>
