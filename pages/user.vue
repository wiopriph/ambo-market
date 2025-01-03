<script setup lang="ts">
import { useUser } from '~/composables/useUser';


const { $fire } = useNuxtApp();
const route = useRoute();

const userId = route.params.userUid;

const { data: user } = await useAsyncData('user', async () => $fire.https('getUserById', { userId }));


const { t } = useI18n();

const userName = user.value?.name;
const userAvatar = user.value?.photoURL;
const userCreationTime = user.value?.creationTime;

const title = computed(() => t('seo.user.title', { name: userName }));
const description = computed(() => t('seo.user.description', { name: userName }));

useHead({
  title: computed(() => title.value),
  meta: computed(() => [
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'og:image', property: 'og:image', content: userAvatar },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
    { key: 'twitter:image', property: 'twitter:image', content: userAvatar },
  ]),
  script: computed(() => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        dateCreated: userCreationTime,
        mainEntity: {
          '@type': 'Person',
          identifier: userId,
          name: userName,
          image: userAvatar,
          description: description.value,
        },
      }),
    },
  ]),
});


const { uid } = useUser();

const isCurrentUser = computed(() => uid.value && (uid.value === userId));


const { isMobileOrTablet } = useDevice();

const hasMobileUserInfo = computed(() => isMobileOrTablet && (route.name === 'user-userUid-status'));
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.left">
      <UserInfo
        v-if="user"
        :user="user"
      />

      <LazyUserMenu
        v-if="isCurrentUser"
        :class="$style.desktopMenu"
      />
    </div>

    <div :class="$style.main">
      <UserInfoMobile
        v-if="hasMobileUserInfo"
        :user="user"
      />

      <NuxtPage />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  display: flex;
  padding-right: 20px;
  padding-left: 20px;

  @include md {
    flex-direction: column;
  }

  @include exclude-md {
    flex-direction: row;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

.left {
  max-width: 300px;
  margin-right: 20px;

  @include md {
    display: none;
  }
}

.desktopMenu {
  margin-top: 20px;

  @include md {
    display: none;
  }
}

.main {
  flex: 1;

  @include md {
    margin-top: 20px;
  }
}
</style>
