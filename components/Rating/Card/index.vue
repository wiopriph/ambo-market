<script setup lang="ts">
import type { RatingCardProps } from './types';
import IconStar from '~/assets/images/icon-star.svg?component';
import { formatFullDate } from '~/utils/formatDate';


const props = defineProps<RatingCardProps>();

const formattedRating = computed(() => {
  if (props.rating) {
    return props.rating.toFixed(1);
  }

  return '0';
});

const userName = computed(() => {
  const userUid = props.user?.id || '';

  return props.user?.name || `User_${userUid.slice(0, 4)}`;
});

const userProfileLink = computed(() => ({
  name: 'user-userUid-status',
  params: {
    userUid: props.user.id,
    status: 'all',
  },
}));

const { locale } = useI18n();

const formattedDate = computed(() => formatFullDate(props.date, locale.value));
</script>


<i18n>
{
  "en": {
    "creation": "on Ambo since {date}",
    "friends": "no friends | {count} friend | {count} friends",
    "read_reviews": "read reviews",
    "no_reviews": "No reviews"
  },
  "pt": {
    "creation": "no Ambo desde {date}",
    "friends": "sem amigos | {count} amigo | {count} amigos",
    "read_reviews": "ler avaliações",
    "no_reviews": "Sem avaliações"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.info">
      <UIAvatar
        :size="48"
        :img="user.photoURL"
        :name="userName"
        :class="$style.avatar"
      />

      <div :class="$style.wrap">
        <NuxtLink
          :to="userProfileLink"
          :class="$style.userName"
        >
          {{ userName }}
        </NuxtLink>

        <span
          :class="$style.reviewCreationTime"
          v-text="formattedDate"
        />
      </div>

      <div :class="$style.ratingWrap">
        <div :class="$style.rating">
          <span
            :class="$style.ratingScore"
            v-text="formattedRating"
          />

          <IconStar :class="$style.ratingIcon" />
        </div>
      </div>
    </div>

    <div :class="$style.review">
      <p
        :class="$style.reviewTitle"
        v-text="product.name"
      />

      <p
        :class="$style.reviewText"
        v-text="review"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-ui-elements;

  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}

.info {
  display: flex;
  width: 100%;
}

.avatar {
  flex-shrink: 0;
}

.wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 16px;
}

.userName {
  @include ui-typo-15-medium;

  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;
}

.reviewCreationTime {
  @include ui-typo-12;

  margin-top: 4px;
  color: $ui-color-text-main;
}

.ratingWrap {
  display: flex;
  align-items: flex-start;
  margin-left: 10px;
}

.rating {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.ratingScore {
  margin-right: 4px;
}

.ratingIcon {
  @include ui-typo-15-bold;
}

.review {
  padding-left: 64px;
}

.reviewTitle {
  @include ui-typo-15-bold;
}

.reviewText {
  margin-top: 4px;
}
</style>
