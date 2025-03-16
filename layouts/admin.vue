<script setup lang="ts">
import { useUser } from '~/composables/useUser';


const { t } = useI18n();

const title = computed(() => t('title'));

useHead({
  title: computed(() => title.value),
});


const { $fire } = useNuxtApp();

const {
  isAuthChecking,
  fetchProfile,
  setCurrentUser,
} = useUser();

let unsubscribeAuthState: (() => void) | null = null;

onMounted(() => {
  unsubscribeAuthState = $fire.auth.onAuthStateChanged(async (user) => {
    isAuthChecking.value = true;

    if (user) {
      try {
        await fetchProfile();

        setTimeout(() => {
          isAuthChecking.value = false;
        }, 1000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error while fetching user profile:', error);
      }
    } else {
      setCurrentUser(null);

      isAuthChecking.value = false;
    }
  });
});

onUnmounted(() => {
  if (unsubscribeAuthState) {
    unsubscribeAuthState();
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Admin - Ambo Market"
  },
  "pt": {
    "title": "Admin - Ambo Market"
  }
}
</i18n>

<template>
  <div :class="$style.page">
    <slot />
  </div>
</template>

<style lang="scss" module>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style>
