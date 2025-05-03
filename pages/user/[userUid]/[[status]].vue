<script setup lang="ts">
const props = defineProps<{ userName: string; }>();

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

const h1 = computed(() => {
  const postStatus = route.params.status as string || 'all';

  return t(`h1.${postStatus}`, { name: props.userName });
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
    "empty_open": "All active listings will be displayed on this page.",
    "empty_closed": "All sold listings will be displayed on this page.",
    "empty_archive": "Blocked or inactive listings will be displayed on this page.",
    "all": "All",
    "open": "Active",
    "closed": "Sold",
    "h1": {
      "all": "All listings by {name}",
      "open": "Active listings by {name}",
      "closed": "Sold listings by {name}"
    }
  },
  "pt": {
    "empty_all": "Todos os anúncios criados serão exibidos nesta página.",
    "empty_open": "Todos os anúncios ativos serão exibidos nesta página.",
    "empty_closed": "Todos os anúncios vendidos serão exibidos nesta página.",
    "empty_archive": "Anúncios bloqueados ou inativos serão exibidos nesta página.",
    "all": "Todos",
    "open": "Ativo",
    "closed": "Vendido",
    "h1": {
      "all": "Todos os anúncios de {name}",
      "open": "Anúncios ativos de {name}",
      "closed": "Anúncios vendidos de {name}"
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1
      v-if="h1"
      :class="$style.title"
      v-text="h1"
    />

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

.title {
  @include ui-typo-24-bold;

  @include md {
    margin-top: 8px;
  }
}

.menu {
  margin-top: 20px;
}

.products {
  margin: 20px 5px;
}
</style>
