<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn, uid } = useUser();

    if (!isLoggedIn.value) {
      return navigateTo({ name: 'auth', query: { redirect: to.path } });
    }

    if (uid.value !== to.params.userUid) {
      return navigateTo({
        name: 'user-userUid-settings',
        params: {
          userUid: uid.value,
        },
      });
    }
  }),
});


const { t } = useI18n();

const { currentUser } = useUser();


const isEditProfileModalVisible = ref(false);

function openEditProfileModal() {
  isEditProfileModalVisible.value = true;
}

function hideEditProfileModal() {
  isEditProfileModalVisible.value = false;
}


const isEditPhoneModalVisible = ref(false);

function openEditPhoneModal() {
  isEditPhoneModalVisible.value = true;
}

function hideEditPhoneModal() {
  isEditPhoneModalVisible.value = false;
}
</script>

<i18n>
{
  "en": {
    "personal_data": "Personal data",
    "profile": "Profile",
    "enter_phone_number": "Enter a phone number for buyers to contact you",
    "enter_email": "Enter your email",
    "add": "Add"
  },
  "pt": {
    "personal_data": "Dados pessoais",
    "profile": "Perfil",
    "enter_phone_number": "Digite o número de telefone para que os compradores possam entrar em contato com você",
    "enter_email": "Digite seu email",
    "add": "Adicionar"
  }
}
</i18n>

<template>
  <div
    v-if="currentUser"
    :class="$style.root"
  >
    <div :class="$style.block">
      <h2
        :class="$style.title"
        v-text="t('personal_data')"
      />

      <ul :class="$style.list">
        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!(currentUser.name || currentUser.photoURL)"
            :title="t('profile')"
            @click="openEditProfileModal"
          >
            <UserProfile
              :userId="currentUser.id"
              :name="currentUser.name"
              :photo="currentUser.photoURL"
            />
          </UserSettingsItem>

          <LazyUserSettingsEditProfileModal
            v-if="isEditProfileModalVisible"
            :name="currentUser.name"
            :photoUrl="currentUser.photoURL"
            @close="hideEditProfileModal"
          />
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!currentUser.phone"
            :title="t('phone_number')"
            :placeholder="t('enter_phone_number')"
            @click="openEditPhoneModal"
          >
            {{ currentUser.phone }}
          </UserSettingsItem>

          <LazyUserSettingsEditPhoneModal
            v-if="isEditPhoneModalVisible"
            :phone="currentUser.phone"
            @close="hideEditPhoneModal"
          />
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!currentUser.email"
            :title="'Email'"
            :placeholder="t('enter_email')"
            disabled
          >
            {{ currentUser.email }}
          </UserSettingsItem>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {

  @include exclude-md {
    @include ui-round-content-blocks;
    padding: 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.title {
  @include ui-typo-24-bold;
}

.list {
  margin-top: 20px;
}

.item {

  &:not(:last-child) {
    border-bottom: 1px solid $ui-color-transparent;
  }
}
</style>
