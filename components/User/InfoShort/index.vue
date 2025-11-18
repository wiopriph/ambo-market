<script setup lang="ts">
import type { UserInfoProps } from './types';


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
</style>
