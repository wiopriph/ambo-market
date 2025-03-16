<script setup lang="ts">
import debounce from 'lodash/debounce';


const { t } = useI18n();

const title = computed(() => t('title'));

useHead({ title: title.value });


const STATUSES = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'hold', label: 'Hold' },
  { value: 'closed', label: 'Closed' },
];

const status = ref('');
const id = ref('');

const orders = ref([]);


const isLoading = ref(false);
const { $fire } = useNuxtApp();

const getOrders = async () => {
  isLoading.value = true;

  try {
    const response = await $fire.https('getAllOrders', { id: `${id.value}`, status: status.value });

    orders.value = response?.orders || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

const debouncedGetOrders = debounce(getOrders, 1000);


const goToOrder = (orderId: string) => navigateTo({
  name: 'orders-orderId',
  params: { orderId },
});

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
    "title": "Orders",
    "filters": "Filters",
    "status": "Status",
    "product": "Product",
    "seller": "Seller",
    "buyer": "Buyer",
    "point": "Point address"
  },
  "pt": {
    "title": "Encomendas",
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
    <div :class="$style.left">
      <div :class="$style.filter">
        <div
          :class="$style.filterItem"
          v-text="t('filters')"
        />

        <UITabs
          v-model="status"
          :options="STATUSES"
          :class="$style.filterItem"
          @update:model-value="getOrders"
        />

        <UIInput
          v-model="id"
          :class="$style.filterItem"
          label="id"
          name="id"
          type="number"
          @update:model-value="debouncedGetOrders"
          @submit="getOrders"
        />
      </div>
    </div>

    <div :class="$style.main">
      <UILoader v-if="isLoading" />

      <ul v-else>
        <li
          v-for="order in orders"
          :key="order.orderId"
          :class="$style.item"
        >
          <div
            :class="$style.order"
            @click="goToOrder(order.orderId)"
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
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  display: flex;
  height: 100%;

  @include md {
    flex-direction: column;
  }

  @include exclude-md {
    flex-direction: row;
    padding: 20px;
  }
}

.left {
  @include exclude-md {
    max-width: 320px;
    margin-right: 20px;
  }
}

.filter {
  @include md {
    margin-bottom: 20px;
  }

  @include exclude-md {
    @include ui-round-content-blocks;
    padding: 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.filterItem {
  & + & {
    margin-top: 10px;
  }
}

.main {
  flex: 1;
}

.item {

  & + & {
    margin-top: 20px;
  }
}

.order {
  @include ui-round-content-blocks;
  padding: 10px 20px;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
  cursor: pointer;
}

.orderLine {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}
</style>
