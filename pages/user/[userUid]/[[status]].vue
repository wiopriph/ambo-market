<script setup lang="ts">
definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { status } = to.params;

    if (!status || ['open', 'closed'].includes(status as string)) {
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

const { data: posts } = await useAsyncData(
  'posts', () => $fire.https('getPostsByUser', {
    userId: route.params.userUid,
    status: route.params.status || '',
  }), {
    watch: [() => route.params],
  });


const ADS_TYPES = ['all', 'open', 'closed'];

const { t } = useI18n();

const menu = computed(() => {
  const userUid = route.params.userUid;

  return ADS_TYPES.map(status => ({
    type: status,
    text: t(status),
    route: {
      name: 'user-userUid-status',
      params: {
        status: status === 'all' ? undefined : status,
        userUid,
      },
    },
  }));
});

const emptyText = computed(() => {
  const status = route.params.status || 'all';

  return t(`empty_${status}`);
});
</script>

<i18n>
{
  "en": {
    "empty_all": "All created listings will be displayed on this page.",
    "empty_open": "All created listings will be displayed on this page.",
    "empty_closed": "All sold listings will be displayed on this page.",
    "empty_archive": "Blocked and inactive listings will be displayed on this page.",
    "all": "All",
    "open": "Active",
    "closed": "Sold"
  },
  "pt": {
    "empty_all": "Todos os anúncios criados serão exibidos nesta página.",
    "empty_open": "Todos os anúncios criados serão exibidos nesta página.",
    "empty_closed": "Todos os anúncios vendidos serão exibidos nesta página.",
    "empty_archive": "Anúncios bloqueados e inativos serão exibidos nesta página.",
    "all": "Todos",
    "open": "Ativo",
    "closed": "Vendido"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <UserNavigation
      :list="menu"
      :class="$style.menu"
    />

    <div :class="$style.products">
      <ProductList
        :list="posts"
        :emptyText="emptyText"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  height: 100%;
}

.menu {
  margin-top: 20px;
}

.products {
  margin: 20px 5px;
}
</style>
