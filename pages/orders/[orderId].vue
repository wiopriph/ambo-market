<script setup lang="ts">
const { $fire } = useNuxtApp();
const route = useRoute();

const { data: order, error: orderError } = await useAsyncData(async () => {
  try {
    return await $fire.https('getOrderDetailsById', { orderId: route.params.orderId });
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

const state = ref({ ...order.value?.state });

const changes = computed(() => Object.keys(state.value)
  .reduce((acc, key) => {
    if (state.value[key] !== order.value?.state[key]) {
      acc[key] = state.value[key];
    }

    return acc;
  }, {} as Record<string, boolean>));

const hasChanges = computed(() => Object.keys(changes.value).length > 0);
const isLoading = ref(false);

const updateOrder = async () => {
  if (!hasChanges.value) {
    return;
  }

  isLoading.value = true;

  try {
    await $fire.https('updateOrder', {
      orderId: route.params.orderId,
      state: changes.value,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  isLoading.value = false;
};

const getLabel = (key: string) => {
  const labels = {
    isApproved: 'Approved',
    isPaid: 'Paid',
    isDelivered: 'Delivered',
    isSold: 'Sold',
    isPaymentReceived: 'Payment Received',
  };

  return labels[key] || key;
};

const getDescription = (key: string) => {
  const labels = {
    isApproved: 'Approved',
    isPaid: 'Paid',
    isDelivered: 'Delivered',
    isSold: 'Sold',
    isPaymentReceived: 'Payment Received',
  };

  return labels[key] || key;
};

const { t } = useI18n();


const getProductLink = (productId: string) => ({
  name: 'product-productId',
  params: { productId },
});

const getUserLink = (userUid: string) => ({
  name: 'user-userUid-status',
  params: {
    userUid,
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Order №{number}",
    "filters": "Filters",
    "status": "Status",
    "product": "Product",
    "seller": "Seller",
    "buyer": "Buyer",
    "point": "Point address"
  },
  "pt": {
    "title": "Order №{number}",
    "filters": "Filtros",
    "status": "Estado",
    "product": "Produto",
    "seller": "Vendedor",
    "buyer": "Comprador",
    "point": "Endereço do ponto"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div
      v-if="order"
      :class="$style.order"
    >
      <UILineDescription
        :title="t('№')"
        :class="$style.orderLine"
        boldTitle
      >
        <strong v-text="order.id" />
      </UILineDescription>

      <UILineDescription
        :title="t('status')"
        :class="$style.orderLine"
      >
        <span v-text="order.status" />
      </UILineDescription>

      <UILineDescription
        :title="t('product')"
        :class="$style.orderLine"
      >
        <NuxtLink
          :to="getProductLink(order.postId)"
          target="_blank"
          @click.stop
        >
          {{ order?.post?.title }}
        </NuxtLink>
      </UILineDescription>

      <UILineDescription
        :title="t('seller')"
        :class="$style.orderLine"
      >
        <NuxtLink
          :to="getUserLink(order.sellerId)"
          target="_blank"
          @click.stop
        >
          {{ order?.seller?.displayName }}
        </NuxtLink>
      </UILineDescription>

      <UILineDescription
        :title="t('buyer')"
        :class="$style.orderLine"
      >
        <NuxtLink
          :to="getUserLink(order.buyerId)"
          target="_blank"
          @click.stop
        >
          {{ order?.buyer?.displayName }}
        </NuxtLink>
      </UILineDescription>

      <UILineDescription
        v-if="order?.point"
        :title="t('point')"
        :class="$style.orderLine"
      >
        {{ order.point?.name }}: {{ order.point?.address }}
      </UILineDescription>

      <UILineDescription
        v-if="state"
        :title="t('state')"
        :class="$style.orderLine"
      >
        <UIToggler
          v-for="(value, key) in state"
          :key="key"
          v-model="state[key]"
          :label="getLabel(key)"
        >
          {{ getDescription(key) }}
        </UIToggler>

        <div :class="$style.buttonWrap">
          <UIButton
            :isLoading="isLoading"
            :disabled="!hasChanges"
            @click="updateOrder"
          >
            Update
          </UIButton>
        </div>
      </UILineDescription>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;
}

.order {
  @include ui-round-content-blocks;

  padding: 20px;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
}

.orderLine {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.buttonWrap {
  margin-top: 20px;
}
</style>
