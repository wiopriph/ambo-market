<script setup lang="ts">
import { useUser } from '~/composables/useUser';


const route = useRoute();

const { data: user, error: orderError } = await useAsyncData(
  () => `user-${route.params.userUid}`,
  async () => {
    try {
      return await $fetch(`/api/users/${route.params.userUid}`);
    } catch (error) {
      if (error?.code === 'functions/not-found') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not found',
          fatal: true,
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load user data',
        fatal: true,
      });
    }
  },
  { watch: [() => route.params] },
);

if (orderError?.value) {
  throw createError(orderError.value);
}

const { t } = useI18n();

const title = computed(() => t('title', { name: user.value?.name }));
const description = computed(() => t('description', { name: user.value?.name }));

const meta = computed(() => [
  { key: 'description', name: 'description', content: description.value },
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'og:description', property: 'og:description', content: description.value },
  { key: 'og:image', property: 'og:image', content: user.value?.photoURL },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'twitter:description', property: 'twitter:description', content: description.value },
  { key: 'twitter:image', property: 'twitter:image', content: user.value?.photoURL },
]);

const script = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      dateCreated: user.value?.creationTime,
      mainEntity: {
        '@type': 'Person',
        identifier: route.params.userUid,
        name: user.value?.name,
        image: user.value?.photoURL,
        description: description.value,
      },
    }),
  },
]);

useHead({ title: title.value, meta: meta.value, script: script.value });


const { uid } = useUser();

const isCurrentUser = computed(() => uid.value && (uid.value === route.params.userUid));


const { isMobileOrTablet } = useDevice();

const hasMobileUserInfo = computed(() => isMobileOrTablet && (route.name === 'user-userUid-status'));
</script>

<i18n lang="json">
{
  "en": {
    "title": "{name} - User Profile on Ambo Market",
    "description": "View {name}'s profile on Ambo Market. Check their recent listings, contact details, and activity history."
  },
  "pt": {
    "title": "{name} - Perfil do Usuário no Ambo Market",
    "description": "Veja o perfil de {name} no Ambo Market. Confira os anúncios recentes, informações de contato e histórico de atividades."
  }
}
</i18n>

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

      <AD
        v-if="false"
        :class="$style.ad"
        type="vertical"
      />
    </div>

    <div :class="$style.main">
      <UserInfoMobile
        v-if="hasMobileUserInfo"
        :user="user"
      />

      <NuxtPage :userName="user?.name" />
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
  position: relative;
  flex: 280px 0;
  max-width: 280px;
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
  flex: 1 1;
  min-width: 0;

  @include md {
    margin-top: 20px;
  }
}

.ad {
  position: sticky;
  top: (64px + 10px);
  margin-top: 20px;
}
</style>
