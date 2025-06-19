<script setup lang="ts">
import type { FavoriteButtonProps } from '~/components/Product/FavoriteButton/types';
import IconHeart from '~/assets/images/header/icon-heart.svg?component';
import { useUser } from '~/composables/useUser';
import { AUTH_ACTIONS } from '~/constants/auth-actions';
import { CLICK_AD_FAVORITE } from '~/constants/analytics-events';


const props = withDefaults(defineProps<FavoriteButtonProps>(), {
  hasText: false,
});

const {
  isLoggedIn,
  isPostInFavorite,
  addPostToFavorite,
  removePostFromFavorite,
} = useUser();

const isLoading = ref(false);

const isFavoritePost = computed(() => isPostInFavorite(props.postId));


const style = useCssModule();

const rootClassNames = computed(() => ({
  [style.root]: true,
  [style.active]: !isLoading.value,
}));

const heartClassNames = computed(() => ({
  [style.icon]: true,
  [style.fill]: isFavoritePost.value,
}));


const { t } = useI18n();

const buttonText = computed(() => (isFavoritePost.value ? t('remove') : t('add')));


const { pushEvent } = useAnalyticsEvent();

const toggleFavorite = async () => {
  pushEvent(CLICK_AD_FAVORITE, { product_id: props.postId });

  if (!isLoggedIn.value) {
    const currentPath = useRoute().path;

    await navigateTo({
      name: 'auth',
      query: {
        action: AUTH_ACTIONS.FAVORITES,
        redirect: currentPath,
      },
    });

    return;
  }

  isLoading.value = true;

  try {
    if (isFavoritePost.value) {
      await removePostFromFavorite(props.postId);
    } else {
      await addPostToFavorite(props.postId);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error toggling favorite status:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<i18n>
{
  "en": {
    "add": "Add to Favorites",
    "remove": "Remove from favorites"
  },
  "pt": {
    "add": "Adicionar aos Favoritos",
    "remove": "Remover dos favoritos"
  }
}
</i18n>

<template>
  <button
    :disabled="isLoading"
    :aria-label="buttonText"
    :class="rootClassNames"
    type="button"
    @click.prevent="toggleFavorite"
  >
    <IconHeart :class="heartClassNames" />

    <span
      v-if="hasText"
      :class="$style.text"
      v-text="buttonText"
    />
  </button>
</template>

<style lang="scss" module>
.root {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 2px;
  background-color: initial;
  border: none;
}

.active {
  cursor: pointer;
  transition: color .2s linear;

  &:hover {
    color: rgb(112, 146, 254);
  }
}

.icon {
  display: block;
  width: 20px;
  height: 20px;
  transition: transform .2s cubic-bezier(.5, 0, .5, 3);

  .active:active & {
    transform: scale(1.1);
  }
}

.fill {
  color: #FF0000;
  fill: #FF0000;

  .active:hover & {
    color: #FF0000;
  }
}

.text {
  @include ui-typo-14;
  margin-left: 10px;
}
</style>
