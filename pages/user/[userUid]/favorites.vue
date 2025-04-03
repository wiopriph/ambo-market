<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn, uid } = useUser();

    if (!isLoggedIn.value) {
      return navigateTo(`/auth?redirect=${to.path}`);
    }

    if (uid.value !== to.params.userUid) {
      return navigateTo({
        name: 'user-userUid-favorites',
        params: {
          userUid: uid.value,
        },
      });
    }
  }),
});

const { $fire } = useNuxtApp();

const { data: posts } = await useAsyncData('favorites_posts', () => $fire.https('getFavoritePosts'));

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "favorites": "Favorites",
    "empty_title": "Favorites are empty",
    "empty_text": "Add items to favorites to view or purchase them later"
  },
  "pt": {
    "favorites": "Favoritos",
    "empty_title": "Favoritos estão vazios",
    "empty_text": "Adicione itens aos favoritos para visualizá-los ou comprá-los posteriormente"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1
      :class="$style.title"
      v-text="t('favorites')"
    />

    <div :class="$style.products">
      <ProductList
        :list="posts"
        :emptyTitle="t('empty_title')"
        :emptyText="t('empty_text')"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title {
  @include ui-typo-24-bold;
}

.menu {
  margin-top: 20px;
}

.products {
  flex-grow: 1;
  margin: 20px 5px;
}
</style>
