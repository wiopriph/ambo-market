<script setup lang="ts">
import type { UserInfoProps } from './types';
import IconStar from '~/assets/images/icon-star.svg?component';


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
</script>


<template>
  <div :class="$style.root">
    <UIAvatar
      :size="32"
      :img="user.photoURL"
      :name="userName"
      :class="$style.avatar"
    />

    <NuxtLink
      :to="userProfileLink"
      :class="$style.userName"
      target="_blank"
    >
      {{ userName }}
    </NuxtLink>

    <div
      v-if="rating"
      :class="$style.rating"
    >
      <span
        :class="$style.ratingText"
        v-text="rating"
      />

      <IconStar :class="$style.ratingIcon" />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.avatar {
  flex-shrink: 0;
  margin-right: 10px;
}

.userName {
  @include ui-typo-15-medium;

  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
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
</style>
