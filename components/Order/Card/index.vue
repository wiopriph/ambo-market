<script setup lang="ts">
import type { OrderCardProps } from './types';
import formatCurrency from '~/utils/formatCurrency';
import { useUser } from '~/composables/useUser';


const props = defineProps<OrderCardProps>();


const { uid } = useUser();

const isSeller = computed(() => uid.value === props.order.seller.id);

const post = computed(() => props.order?.post || {});


const { t } = useI18n();

const orderTitle = computed(() => t('title', { number: props.order.id }));

const orderStatus = computed(() => {
  if (isSeller.value) {
    return props.order.messages.seller;
  }

  return props.order.messages.buyer;
});

const formattedPrice = computed(() => formatCurrency(props.order?.price));

const orderLink = computed(() => ({
  name: 'order-orderId',
  params: { orderId: props.order.orderId },
}));

const goToOrder = () => {
  navigateTo(orderLink.value);
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Order №{number}"
  },
  "pt": {
    "title": "Order №{number}"
  }
}
</i18n>

<template>
  <NuxtLink
    :to="orderLink"
    :class="$style.root"
    rel="noopener noreferrer"
  >
    <div :class="$style.main">
      <div :class="$style.photo">
        <NuxtImg
          v-if="post"
          :src="post.preview"
          :alt="post.title"
          :class="$style.productPhoto"
          loading="lazy"
        />
      </div>

      <div :class="$style.productInfo">
        <span
          :class="$style.orderTitle"
          v-text="orderTitle"
        />

        <span
          :class="$style.productTitle"
          v-text="post.title"
        />

        <span
          :class="$style.productPrice"
          v-text="formattedPrice"
        />
      </div>
    </div>

    <div :class="$style.status">
      <OrderState
        :orderId="order.orderId"
        :status="orderStatus"
        @approve-order="goToOrder"
      />
    </div>
  </NuxtLink>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;
  display: flex;
  height: 100%;
  overflow: hidden;
  color: $ui-color-black;
  text-decoration: none;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
  transition: box-shadow .2s linear;

  @include md {
    flex-direction: column;
    padding: 10px;
  }

  @include exclude-md {
    flex-direction: row;
    padding: 20px;

    &:hover {
      box-shadow: rgba(0, 0, 0, .1) 0 8px 16px 0;
    }
  }
}

.main {
  display: flex;
  flex: 1;
  flex-direction: row;

  @include md {
    margin-bottom: 20px;
  }

  @include exclude-md {
    margin-right: 20px;
  }
}

.photo {
  flex-shrink: 0;
  width: 100px;
  height: 100px;

  @include md {
    margin-right: 10px;
  }

  @include exclude-md {
    margin-right: 20px;
  }
}

.productPhoto {
  @include ui-round-ui-elements;

  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  background-color: #FAFAFA;
}

.productInfo {
  display: flex;
  flex-direction: column;
}

.orderTitle {
  @include ui-typo-15-bold;
}

.productTitle {
  margin-top: 10px;
}

.productPrice {
  @include ui-typo-18-bold;
  margin-top: 10px;
}

.status {

  @include exclude-md {
    max-width: 340px;
  }
}
</style>
