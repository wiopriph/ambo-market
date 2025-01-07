<script setup lang="ts">
definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { status } = to.params;

    if (['buy', 'sell'].includes(status as string)) {
      return;
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
    });
  }),
});

const { $fire } = useNuxtApp();
const route = useRoute();

const { data: orders } = await useAsyncData('orders', () => $fire.https('getOrders', { status: route.params.status }));


const { t } = useI18n();

const ORDER_STATUS_LIST = ['buy', 'sell'] as const;

const menu = computed(() =>
  ORDER_STATUS_LIST.map(status => ({
    text: t(status),
    route: {
      name: 'order-history-status',
      params: { status },
    },
  })),
);

const emptyText = computed(() => {
  const status = route.params.status;

  return t(`${status}_empty`);
});
</script>

<i18n lang="json">
{
  "en": {
    "my_orders": "My orders",
    "no_orders": "No orders",
    "buy": "Purchases",
    "buy_empty": "Orders for purchased items will be displayed on this page",
    "sell": "Sales",
    "sell_empty": "Orders for sold items will be displayed on this page"
  },
  "pt": {
    "my_orders": "Minhas ordens",
    "no_orders": "Sem ordens",
    "buy": "Compras",
    "buy_empty": "Os pedidos dos itens comprados serão exibidos nesta página",
    "sell": "Vendas",
    "sell_empty": "Os pedidos dos itens vendidos serão exibidos nesta página"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h2
      :class="$style.title"
      v-text="t('my_orders')"
    />

    <UserNavigation
      :list="menu"
      :class="$style.menu"
    />

    <div :class="$style.orders">
      <template v-if="orders?.length">
        <ul>
          <li
            v-for="order in orders"
            :key="order.id"
            :class="$style.item"
          >
            <OrderCard :order="order" />
          </li>
        </ul>
      </template>

      <ProductListEmpty
        v-else
        :customTitle="t('no_orders')"
        :customText="emptyText"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  height: 100%;
}

.title {
  @include ui-typo-24-bold;
}

.menu {
  margin-top: 20px;
}

.orders {
  margin: 20px 5px;
}

.item {

  & + & {
    margin-top: 10px;
  }
}
</style>
