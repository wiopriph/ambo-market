<script setup lang="ts">
import type { UserInfoProps } from './types';
import { formatFullDate } from '~/utils/formatDate';


const props = defineProps<UserInfoProps>();

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
        :size="100"
        :img="user.photoURL"
        :name="userName"
        :class="$style.avatar"
      />

      <span
        :class="$style.userName"
        v-text="userName"
      />

      <span
        :class="$style.userCreationTime"
        v-text="t('creation', { date: formattedDate })"
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
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.avatar {
  flex-shrink: 0;
}

.userName {
  @include ui-typo-18-bold;

  margin-top: 10px;
  overflow: hidden;
  color: $ui-color-black;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.userCreationTime {
  @include ui-typo-12;

  margin-top: 8px;
  color: $ui-color-text-main;
}

.verified {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.verifiedIcon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
