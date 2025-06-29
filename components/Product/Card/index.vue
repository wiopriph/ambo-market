<script setup lang="ts">
import type { CardProps } from './types';
import IconShield from '~/assets/images/product/icon-shield.svg?component';
import formatCurrency from '~/utils/formatCurrency';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';
import { getPostRoute } from '~/utils/getPostRoute';
import { CLICK_PRODUCT_CARD } from '~/constants/analytics-events';


const props = defineProps<CardProps>();

const formattedPrice = computed(() => formatCurrency(props.product?.price));
const city = computed(() => props.product?.location?.displayName || '');
const previewImage = computed(() => props.product?.preview || '');
const productTitle = computed(() => props.product?.title || '\u00A0');

const hasStatus = computed(() => props.product?.status !== POST_STATUSES.OPEN);

const link = computed(() => getPostRoute({
  cityId: getCityIdByName(props.product?.location?.city),
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
    :class="$style.root"
    target="_blank"
    rel="noopener noreferrer"
    @click="pushEvent(CLICK_PRODUCT_CARD, { product_id: props.product?.id })"
  >
    <div :class="$style.photoWrap">
      <div :class="$style.line">
        <div
          v-if="product.isSafeDeal"
          :class="$style.safeDeal"
        >
          <IconShield />
        </div>

        <span
          v-if="city"
          :class="$style.address"
          v-text="city"
        />
      </div>

      <ProductStatus
        v-if="hasStatus"
        :status="product.status"
        :class="$style.status"
      />

      <NuxtImg
        :src="previewImage"
        :alt="productTitle"
        :class="$style.photo"
      />
    </div>

    <div :class="$style.info">
      <div :class="$style.favorite">
        <span
          :class="$style.price"
          v-text="formattedPrice"
        />

        <ProductFavoriteButton :postId="product.id" />
      </div>

      <div
        :class="$style.name"
        v-text="productTitle"
      />
    </div>
  </NuxtLink>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  color: $ui-color-black;
  text-decoration: none;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
  transition: box-shadow .2s linear;

  @include exclude-md {

    &:hover {
      box-shadow: rgba(0, 0, 0, .1) 0 8px 16px 0;
    }
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
  object-fit: cover;
  background-color: $ui-color-transparent;
  border: none;
}

$card-indent: 10px;

@mixin badge {
  @include ui-round-ui-elements;

  overflow: hidden;
  color: $ui-color-white;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: rgba($ui-color-black, .5);
  backdrop-filter: blur(1px);
}

.line {
  position: absolute;
  right: $card-indent;
  bottom: $card-indent;
  left: $card-indent;
  z-index: 1;
  display: flex;
  align-items: center;
}

.safeDeal {
  @include badge;

  min-width: 22px;
  margin-right: 4px;
  padding: 3px;
  line-height: 0;

  svg {
    width: 16px;
    height: 16px;
  }
}

.address {
  @include badge;
  @include ui-typo-12;

  padding: 2px 6px;
}

.status {
  position: absolute;
  top: $card-indent;
  left: $card-indent;
  z-index: 1;
}

.info {
  padding: 10px;
}

.favorite {
  display: flex;
  justify-content: space-between;
}

.price {
  @include ui-typo-16-bold;
  line-height: 24px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.name {
  @include ui-typo-14;

  margin-top: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
