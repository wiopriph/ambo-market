<script setup lang="ts">
import type { ChatProductInfoProps } from './types';
import formatAmount from '~/utils/formatAmount';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<ChatProductInfoProps>();

const isClosedPost = computed(() => props.product?.status === POST_STATUSES.CLOSED);


const { t } = useI18n();

const price = computed(() => {
  const { price } = props.product;
  const formattedPrice = formatAmount(price, 0);

  if (formattedPrice) {
    return `${formattedPrice} AOA`;
  }

  return t('free');
});


const linkToProduct = computed(() => ({
  name: 'cityId-categoryId-productId',
  params: {
    categoryId: props.product?.categoryId,
    cityId: getCityIdByName(props.product?.location?.city),
    productId: props.product?.id,
  },
}));


const isShowNumberModalVisible = ref(false);

const showShowNumberModal = () => {
  isShowNumberModalVisible.value = true;
};

const hideShowNumberModal = () => {
  isShowNumberModalVisible.value = false;
};


const createOrder = () => {
  navigateTo({
    name: 'product-productId-buy',
    params: { productId: props.product?.id },
  });
};
</script>

<i18n lang="json">
{
  "en": {
    "call": "Call",
    "buy": "Buy",
    "free": "Free"
  },
  "pt": {
    "call": "Call",
    "buy": "Buy",
    "free": "De graça"
  }
}
</i18n>

<template>
  <div :class="$style.product">
    <div :class="$style.productInfo">
      <div :class="$style.photo">
        <UIImage
          :size="32"
          :img="product.image"
          :name="product.title"
        />
      </div>

      <div :class="$style.productDescription">
        <NuxtLink
          :to="linkToProduct"
          :class="$style.productName"
        >
          {{ product.title }}
        </NuxtLink>

        <ProductStatus
          v-if="isClosedPost"
          :status="product.status"
          :class="$style.productStatus"
        />

        <span
          v-else
          :class="$style.productPrice"
          v-text="price"
        />
      </div>
    </div>

    <ul
      v-if="!isClosedPost"
      :class="$style.buttons"
    >
      <li>
        <UIButton
          :text="t('call')"
          @click="showShowNumberModal"
        />
      </li>

      <li
        v-if="product.isSafeDeal"
        :class="$style.buyButton"
      >
        <UIButton
          :text="t('buy')"
          type="tertiary"
          @click="createOrder"
        />
      </li>
    </ul>

    <transition name="fade">
      <LazyProductShowNumberModal
        v-if="isShowNumberModalVisible"
        :user="user"
        @close="hideShowNumberModal"
      />
    </transition>
  </div>
</template>

<style lang="scss" module>
.product {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.productInfo {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.photo {
  @include ui-round-ui-elements;

  position: relative;
  display: block;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  margin-right: 10px;
  overflow: hidden;
}

.productDescription {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.productName {
  @include ui-typo-18-bold;

  &:hover {
    text-decoration: underline;
  }
}

.productStatus {
  margin-top: 8px;
}

.productPrice {
  margin-top: 8px;
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.buyButton {
  margin-left: 10px;
}
</style>
