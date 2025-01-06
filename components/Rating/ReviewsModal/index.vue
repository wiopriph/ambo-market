<script setup lang="ts">
import type { RatingReviewsModalProps, Review } from './types';
import IconStar from '~/assets/images/icon-star.svg?component';


const props = defineProps<RatingReviewsModalProps>();


const rating = ref<number | null>(null);
const reviews = ref<Review[]>([]);

const formattedRating = computed(() => (rating.value ? rating.value.toFixed(1) : '0'));
const reviewsCount = computed(() => reviews.value?.length);


const { $fire } = useNuxtApp();

const isLoading = ref<boolean>(true);

onMounted(async () => {
  try {
    const response = await $fire.https('getReviews', { userId: props.userId });

    rating.value = response?.rating;
    reviews.value = response?.reviews;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});


const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "rating": "Rating - {value}",
    "based": "Based on {count}",
    "ratings": "no reviews | {count} review | {count} reviews",
    "empty": "User has no rating",
    "reviews": "Reviews",
    "no_reviews": "No reviews"
  },
  "pt": {
    "rating": "Avaliação - {value}",
    "based": "Com base em {count}",
    "ratings": "sem avaliações | {count} avaliação | {count} avaliações",
    "empty": "O usuário não tem classificação",
    "reviews": "Avaliações",
    "no_reviews": "Sem avaliações"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('reviews')"
    maxWidth="600px"
    @close="close"
  >
    <div :class="$style.root">
      <UILoader
        v-if="isLoading"
        :class="$style.loader"
      />

      <template v-else-if="rating">
        <div :class="$style.board">
          <div :class="$style.boardHeader">
            <h6
              :class="$style.boardTitle"
              v-text="t('rating', { value: formattedRating })"
            />

            <IconStar :class="$style.starIcon" />
          </div>

          <I18nT
            v-if="reviewsCount"
            keypath="based"
            tag="p"
            :class="$style.reviewsCount"
          >
            <template #count>
              {{ t('ratings', reviewsCount) }}
            </template>
          </I18nT>
        </div>

        <ul
          v-if="reviewsCount"
          :class="$style.list"
        >
          <li
            v-for="review in reviews"
            :key="review.id"
            :class="$style.item"
          >
            <RatingCard
              :user="review.author"
              :product="review.product"
              :date="review.createdAt"
              :rating="review.rating"
              :review="review.message"
            />
          </li>
        </ul>

        <div
          v-else
          :class="$style.noReviews"
        >
          <p v-text="t('no_reviews')" />
        </div>
      </template>

      <div
        v-else
        :class="$style.empty"
        v-text="t('empty')"
      />
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  padding: 20px;
  overflow: auto;

  @include md {
    height: calc(100% - 44px);
  }
}

.loader {
  padding-top: 70px;
  padding-bottom: 70px;
}

.board {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.boardHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.boardTitle {
  @include ui-typo-20-bold;
}

.starIcon {
  width: 24px;
  height: 24px;
  margin-left: 4px;
}

.reviewsCount {
  margin-top: 10px;
}

.list {
  margin-top: 20px;
}

.item {
  border-top: 1px solid $ui-color-transparent;
}

.noReviews {
  padding: 20px 0;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
</style>

