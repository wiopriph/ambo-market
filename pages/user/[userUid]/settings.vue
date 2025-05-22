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


const isSafeTransaction = ref(true);

const card = ref(null);
const deliveryAddress = ref(null);
const notificationsCount = ref(10);
const callsEnabled = ref(true);
const blockedUsersCount = ref(1);


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
    "enter_phone_number": "Enter phone number for buyers to contact you",
    "enter_email": "Enter your email",
    "general_settings": "General settings",
    "safe_transaction": "Safe transaction",
    "products_not_available_safe_transaction": "Your products are not available for sale through safe transactions with online payment.",
    "products_available_safe_transaction": "Your products are available for sale through safe transactions with online payment.",
    "learn_more": "Learn More",
    "bank_card": "Bank Card",
    "add": "Add",
    "add_bank_card": "Add Bank Card",
    "delivery": "Delivery",
    "delivery_details": "These details will be required when purchasing items with delivery.",
    "notifications": "Notifications",
    "notifications_disabled": "All notifications are disabled",
    "notification_type_active": "{count} active notifications",
    "call_settings": "Call settings",
    "edit_call_settings": "Edit",
    "calls_disabled": "Calls disabled",
    "calls_enabled": "Calls enabled",
    "blacklist": "Blacklist",
    "nobody": "Nobody",
    "people": "{count} people"
  },
  "pt": {
    "personal_data": "Dados pessoais",
    "profile": "Perfil",
    "enter_phone_number": "Digite o número de telefone para que os compradores possam entrar em contato com você",
    "enter_email": "Digite seu email",
    "general_settings": "Configurações gerais",
    "safe_transaction": "Transação segura",
    "products_not_available_safe_transaction": "Seus produtos não estão disponíveis para venda por meio de transações seguras com pagamento online.",
    "products_available_safe_transaction": "Seus produtos estão disponíveis para venda por meio de transações seguras com pagamento online.",
    "learn_more": "Saiba Mais",
    "bank_card": "Cartão Bancário",
    "add": "Adicionar",
    "add_bank_card": "Adicionar Cartão Bancário",
    "delivery": "Entrega",
    "delivery_details": "Estes detalhes serão necessários ao comprar itens com entrega.",
    "notifications": "Notificações",
    "notifications_disabled": "Todas as notificações estão desativadas",
    "notification_type_active": "{count} notificações ativas",
    "call_settings": "Configurações de chamadas",
    "edit_call_settings": "Editar",
    "calls_disabled": "Chamadas desativadas",
    "calls_enabled": "Chamadas habilitadas",
    "blacklist": "Lista negra",
    "nobody": "Ninguém",
    "people": "{count} pessoas"
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

    <div
      v-if="false"
      :class="$style.block"
    >
      <h2
        :class="$style.title"
        v-text="t('general_settings')"
      />

      <UIToggler
        v-model="isSafeTransaction"
        :label="t('safe_transaction')"
      >
        <p>
          <span
            v-if="isSafeTransaction"
            v-text="t('products_available_safe_transaction')"
          />

          <span
            v-else
            v-text="t('products_not_available_safe_transaction')"
          />

          <NuxtLink
            :to="{ name: 'privacy' }"
            target="_blank"
          >
            {{ t('learn_more') }}
          </NuxtLink>
        </p>
      </UIToggler>

      <ul :class="$style.list">
        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!card"
            :title="t('bank_card')"
            :setButtonText="t('add')"
            :placeholder="t('add_bank_card')"
          >
            <span v-text="card" />
          </UserSettingsItem>
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!deliveryAddress"
            :title="t('delivery')"
            :setButtonText="t('add')"
            :placeholder="t('delivery_details')"
          >
            <span v-text="deliveryAddress" />
          </UserSettingsItem>
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!notificationsCount"
            :title="t('notifications')"
            :placeholder="t('notifications_disabled')"
          >
            <span v-text="t('notification_type_active', { count: notificationsCount })" />
          </UserSettingsItem>
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!callsEnabled"
            :title="t('call_settings')"
            :setButtonText="t('edit_call_settings')"
            :placeholder="t('calls_disabled')"
          >
            <span v-text="t('calls_enabled')" />
          </UserSettingsItem>
        </li>

        <li :class="$style.item">
          <UserSettingsItem
            :isFilled="!!blockedUsersCount"
            :title="t('blacklist')"
            :setButtonText="''"
            :placeholder="t('nobody')"
          >
            <span v-text="t('people', { count: blockedUsersCount })" />
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

.block {
  //margin-bottom: 80px;
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
