<script setup lang="ts">
import type { UserInfoProps } from './types';
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

const { t, locale } = useI18n();

const formattedDate = computed(() => {
  const creationTime = props.user?.creationTime;

  if (!creationTime) {
    return '';
  }

  return formatFullDate(creationTime, locale.value);
});
</script>

<i18n>
{
  "en": {
    "creation": "on Ambo since {date}",
    "profile_verified": "Profile verified",
    "profile_not_verified": "Profile not verified"
  },
  "pt": {
    "creation": "no Ambo desde {date}",
    "profile_verified": "Perfil verificado",
    "profile_not_verified": "Perfil não verificado"
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
      </div>
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
</style>
