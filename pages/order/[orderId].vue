<script setup lang="ts">
import formatAmount from '~/utils/formatAmount';
import { useUser } from '~/composables/useUser';
import type { Point } from '~/components/Order/PointCard/types';


interface OrderData {
  orderId: string;
  id: string;
  price: number;
  post: {
    id: string;
    title: string;
  };
  seller: {
    id: string;
    name?: string;
  };
  buyer: {
    id: string;
    name?: string;
  };
  messages: {
    seller?: string;
    buyer?: string;
  };
  point: Point;
}


const { $fire } = useNuxtApp();
const route = useRoute();

const { data: orderData, error: orderError } = await useAsyncData(async () => {
  try {
    return await $fire.https('getOrderById', { orderId: route.params.orderId });
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load order data',
    });
  }
});

if (orderError?.value) {
  throw createError(orderError.value);
}

const {
  orderId,
  id,
  price,
  post,
  seller,
  buyer,
  point,
} = orderData.value as OrderData;

const messages = ref(orderData.value?.messages);


const { uid } = useUser();

const isSeller = computed(() => uid.value === seller.id);


const { t } = useI18n();

const orderTitle = computed(() => t('title', { number: id }));
const formattedPrice = computed(() => `${formatAmount(price, 0)} AOA`);

const productLink = computed(() => ({
  name: 'product-productId',
  params: { productId: post.id },
}));


// @todo: добавить условие для hasCancellationOrder
const hasCancellationOrder = computed(() => false);


const cancelOrder = () => {
  try {
    // @todo: добавить отмену заказа
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const updateOrder = async () => {
  try {
    const order = await $fire.https('getOrderById', { orderId: id });

    messages.value = order?.messages;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};


const isChatLoading = ref(false);

const createChatRoom = async () => {
  try {
    isChatLoading.value = true;

    const chat = await $fire.https('createChat', {
      senderId: seller.id,
      receiverId: buyer.id,
      postId: post.id,
    });

    if (chat && chat.chatId) {
      await navigateTo({
        name: 'im-chat-chatId',
        params: { chatId: chat.chatId },
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    isChatLoading.value = false;
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Order №{number}",
    "status": "Status",
    "point": "Pickup point",
    "buyer": "Buyer",
    "seller": "Seller",
    "chat": "Chat",
    "contact_buyer": "Contact buyer",
    "contact_seller": "Contact seller",
    "product": "Product",
    "total": "Total",
    "cancel_order": "Cancel the order"
  },
  "pt": {
    "title": "Order №{number}",
    "status": "Status",
    "point": "Ponto de coleta",
    "buyer": "Comprador",
    "seller": "Vendedor",
    "chat": "Chat",
    "contact_buyer": "Contatar comprador",
    "contact_seller": "Contatar vendedor",
    "product": "Produtos",
    "total": "Total",
    "cancel_order": "Cancelar o pedido"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h2
      :class="$style.title"
      v-text="orderTitle"
    />

    <div>
      <template v-if="isSeller">
        <UILineDescription
          :title="t('status')"
          :class="$style.order"
        >
          <OrderState
            :orderId="orderId"
            :status="messages.seller"
            @approve-order="updateOrder"
          />
        </UILineDescription>

        <UILineDescription
          :title="t('product')"
          :class="$style.order"
          position="center"
        >
          <NuxtLink
            :to="productLink"
          >
            {{ post.title }}
          </NuxtLink>
        </UILineDescription>

        <UILineDescription
          :title="t('buyer')"
          :class="$style.order"
          position="center"
        >
          <UserInfoShort :user="buyer" />
        </UILineDescription>

        <UILineDescription
          :title="t('chat')"
          :class="$style.order"
        >
          <UIButton
            :text="t('contact_seller')"
            :isLoading="isChatLoading"
            :class="$style.chatButton"
            @click="createChatRoom"
          />
        </UILineDescription>
      </template>

      <template v-else>
        <UILineDescription
          :title="t('status')"
          :class="$style.order"
        >
          <OrderState
            :orderId="orderId"
            :status="messages.buyer"
            @approve-order="updateOrder"
          />
        </UILineDescription>

        <UILineDescription
          v-if="point"
          :title="t('point')"
          :class="$style.order"
        >
          <OrderPointCard :point="point" />
        </UILineDescription>

        <UILineDescription
          :title="t('product')"
          :class="$style.order"
          position="center"
        >
          <NuxtLink :to="productLink">
            {{ post.title }}
          </NuxtLink>
        </UILineDescription>

        <UILineDescription
          :title="t('seller')"
          :class="$style.order"
          position="center"
        >
          <UserInfoShort :user="seller" />
        </UILineDescription>

        <UILineDescription
          :title="t('chat')"
          :class="$style.order"
        >
          <UIButton
            :text="t('contact_buyer')"
            :isLoading="isChatLoading"
            :class="$style.chatButton"
            @click="createChatRoom"
          />
        </UILineDescription>
      </template>

      <UILineDescription
        :title="t('total')"
        :class="$style.order"
        position="center"
        boldTitle
      >
        <span v-text="formattedPrice" />
      </UILineDescription>

      <div
        v-if="hasCancellationOrder"
        :class="$style.buttonWrap"
      >
        <button
          type="button"
          :class="$style.button"
          @click="cancelOrder"
          v-text="t('cancel_order')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {

  @include exclude-md {
    @include ui-round-content-blocks;
    padding: 20px 20px 10px 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.title {
  @include ui-typo-24-bold;
  margin-bottom: 20px;
}

.order {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.chatButton {
  margin-top: 10px;
}

.buttonWrap {
  display: flex;
  justify-content: flex-end;
}

.button {
  @include ui-button;
  padding: 13px 0;
  text-decoration: underline;
  border: none;
  transition: color .2s linear;

  &:hover {
    color: $ui-color-blue-light;
  }
}
</style>
