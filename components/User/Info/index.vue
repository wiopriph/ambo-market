<script setup lang="ts">
import type { UserInfoProps } from './types';
import IconVerified from '~/assets/images/profile/icon-verified.svg?component';
import IconUnverified from '~/assets/images/profile/icon-unverified.svg?component';
import IconFB from '~/assets/images/icon-fb.svg?component';
import IconStar from '~/assets/images/icon-star.svg?component';
import { formatFullDate } from '~/utils/formatDate';


const props = defineProps<UserInfoProps>();

const userProfileLink = computed(() => ({
  name: 'user-userUid-status',
  params: {
    userUid: props.user?.id,
  },
}));

const userName = computed(() => {
  const name = props.user?.name;
  const userId = props.user?.id;

  return name || `User_${userId.slice(0, 4)}`;
});

const rating = computed(() => {
  const userRating = props.user?.rating || 0;

  if (userRating) {
    return userRating.toFixed(1);
  }

  return userRating;
});


const { t, locale } = useI18n();

const formattedDate = computed(() => {
  const creationTime = props.user?.creationTime;

  if (!creationTime) {
    return '';
  }

  return formatFullDate(creationTime, locale.value);
});

const friendCount = computed(() => props.user?.friendCount || 0);


const isReviewModalVisible = ref(false);

const showReviewModal = () => {
  isReviewModalVisible.value = true;
};

const hideReviewModal = () => {
  isReviewModalVisible.value = false;
};
</script>

<i18n>
{
  "en": {
    "creation": "on Ambo since {date}",
    "profile_verified": "Profile verified",
    "profile_not_verified": "Profile not verified",
    "fb_verified": "Facebook verified, {friends}",
    "friends": "no friends | {count} friend | {count} friends",
    "read_reviews": "read reviews",
    "no_reviews": "No reviews"
  },
  "pt": {
    "creation": "no Ambo desde {date}",
    "profile_verified": "Perfil verificado",
    "profile_not_verified": "Perfil não verificado",
    "fb_verified": "Facebook verificado, {friends}",
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
        :size="60"
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
          :class="$style.userCreationTime"
          v-text="t('creation', { date: formattedDate })"
        />

        <div :class="$style.userReview">
          <template v-if="rating">
            <div :class="$style.rating">
              <span
                :class="$style.ratingText"
                v-text="rating"
              />

              <IconStar :class="$style.ratingIcon" />
            </div>

            <button
              :class="$style.reviewButton"
              type="button"
              @click="showReviewModal"
              v-text="t('read_reviews')"
            />
          </template>

          <template v-else>
            <span v-text="t('no_reviews')" />
          </template>
        </div>
      </div>
    </div>

    <div
      v-if="false"
      :class="$style.verified"
    >
      <template v-if="user.emailVerified">
        <IconVerified :class="$style.verifiedIcon" />

        <span v-text="t('profile_verified')" />
      </template>

      <template v-else>
        <IconUnverified :class="$style.verifiedIcon" />

        <span v-text="t('profile_not_verified')" />
      </template>
    </div>

    <div
      v-if="user.fbVerified"
      :class="$style.verified"
    >
      <IconFB :class="$style.socialIcon" />

      <I18nT
        keypath="fb_verified"
        tag="span"
      >
        <template #friends>
          {{ t('friends', friendCount) }}
        </template>
      </I18nT>
    </div>

    <transition name="fade">
      <RatingReviewsModal
        v-if="isReviewModalVisible"
        :userId="user.id"
        @close="hideReviewModal"
      />
    </transition>
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
  width: calc(100% - 64px);
  margin-left: 10px;
}

.userName {
  @include ui-typo-15-medium;

  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
}

.userCreationTime {
  @include ui-typo-12;

  margin-top: 4px;
  color: $ui-color-text-main;
}

.userReview {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
}

.rating {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
}

.ratingText {
  @include ui-typo-15-bold;
}

.ratingIcon {
  width: 18px;
  height: 18px;
  margin-left: 8px;
}

.reviewButton {
  @include ui-button;
  @include ui-typo-12;

  padding: 0;
  color: $ui-color-black;
  text-decoration: underline;
  border: none;
  transition: color .2s linear;

  &:hover {
    color: $ui-color-blue-light;
  }
}

.verified {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid $ui-color-transparent;
}

.verifiedIcon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.socialIcon {
  width: 24px;
  height: 24px;
}
</style>
