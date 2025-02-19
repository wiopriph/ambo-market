<script setup lang="ts">
import type { ChatProductInfoProps } from './types';
import formatCurrency from '~/utils/formatCurrency';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<ChatProductInfoProps>();

const isSeller = computed(() => props.product?.userId === props.user?.id);
const isClosedPost = computed(() => props.product?.status === POST_STATUSES.CLOSED);
const hasBuyButton = computed(() => props.product?.isSafeDeal && props.product?.status === POST_STATUSES.OPEN);


const { t } = useI18n();

const formattedPrice = computed(() => formatCurrency(props.product?.price));

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
    "buy": "Buy"
  },
  "pt": {
    "call": "Call",
    "buy": "Buy"
  }
}
</i18n>

<template>
  <div :class="$style.product">
    <div :class="$style.productInfo">
      <div :class="$style.photo">
        <NuxtImg
          :src="product.image"
          :alt="product.title"
          :class="$style.productPhoto"
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
          v-text="formattedPrice"
        />
      </div>
    </div>

    <ul
      v-if="isSeller && !isClosedPost"
      :class="$style.buttons"
    >
      <li>
        <UIButton
          :text="t('call')"
          @click="showShowNumberModal"
        />
      </li>

      <li
        v-if="hasBuyButton"
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
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  margin-right: 10px;
}

.productPhoto {
  @include ui-round-ui-elements;

  width: 100%;
  height: 100%;
  object-fit: cover;
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
