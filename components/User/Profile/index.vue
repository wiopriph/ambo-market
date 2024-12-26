<script setup lang="ts">
import type { UserProfileProps } from './types';


const props = defineProps<UserProfileProps>();

const userName = computed(() => props.name || `User_${props.userId.slice(0, 4)}`);
</script>

<template>
  <div :class="$style.profile">
    <UIAvatar
      :size="32"
      :img="photo"
      :name="userName"
      :class="$style.avatar"
    />

    <span
      :class="$style.name"
      v-text="userName"
    />
  </div>
</template>

<style lang="scss" module>
.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.avatar {
  flex-shrink: 0;
}

.name {
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
