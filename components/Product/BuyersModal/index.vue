<script setup lang="ts">
import type { BuyerData, PostData, BuyersModalProps } from '~/components/Product/BuyersModal/types';


const props = defineProps<BuyersModalProps>();


const { t } = useI18n();

const isRated = ref(false);
const isLoading = ref(true);

const buyers = ref<BuyerData[]>([]);
const post = ref<PostData | null>(null);

const { $fire } = useNuxtApp();

const fetchChatUsers = async () => {
  try {
    const response = await $fire.https('getChatParticipantsByPost', { postId: props.postId });

    buyers.value = response as BuyerData[] || [];

    if (!buyers.value.length) {
      await selectBuyer(null);
    }
  } catch {
    close();
  } finally {
    isLoading.value = false;
  }
};

const selectBuyer = async (buyerId: string | null) => {
  isLoading.value = true;

  try {
    const response = await $fire.https('closePost', { postId: props.postId, buyerId });

    post.value = response?.post || null;

    isRated.value = true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};


const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};


onMounted(fetchChatUsers);
</script>

<i18n lang="json">
{
  "en": {
    "select_buyer": "Select the buyer",
    "congratulations": "Congratulations on the sale! Please select a buyer from the list to earn reputation",
    "buyer_not_exist": "Buyer is not in the list",
    "closed": "Ad removed from publication"
  },
  "pt": {
    "select_buyer": "Especifique o comprador",
    "congratulations": "Parabéns pela venda! Por favor, selecione um comprador da lista para ganhar reputação",
    "closed": "Anúncio removido da publicação"
  }
}
</i18n>

<template>
  <UIModal
    maxWidth="500px"
    @close="close"
  >
    <div :class="$style.root">
      <UILoader
        v-if="isLoading"
        :class="$style.loader"
      />

      <div
        v-else-if="isRated"
        :class="$style.closed"
      >
        <div :class="$style.closedWrap">
          <LazyProductCard
            :product="post"
            :class="$style.closedCard"
          />
        </div>

        <p
          :class="$style.closedText"
          v-text="t('closed')"
        />

        <UIButton
          :class="$style.button"
          text="OK"
          @click="close"
        />
      </div>

      <template v-else>
        <h3
          :class="$style.title"
          v-text="t('select_buyer')"
        />

        <p
          :class="$style.text"
          v-text="t('congratulations')"
        />

        <ul :class="$style.list">
          <li
            v-for="user in buyers"
            :key="user.userId"
            :class="$style.item"
          >
            <button
              :class="$style.buyer"
              type="button"
              @click="selectBuyer(user.userId)"
            >
              <UserProfile
                :userId="user.userId"
                :photo="user.userPhoto"
                :name="user.userName"
                :class="$style.profile"
              />
            </button>
          </li>
        </ul>

        <div :class="$style.footer">
          <UIButton
            :text="t('buyer_not_exist')"
            :class="$style.button"
            @click="selectBuyer(null)"
          />
        </div>
      </template>
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  position: relative;
  height: calc(100% - 44px);
  padding: 20px;
}

.loader {
  padding-top: 70px;
  padding-bottom: 70px;
}

.closed {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.closedWrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.closedCard {
  width: 180px;
  height: initial !important;
}

.closedText {
  @include ui-typo-18-bold;

  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.title {
  @include ui-typo-36-medium;
}

.text {
  @include ui-typo-15;

  margin-top: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 360px;
  margin-top: 24px;
  padding-bottom: 64px; // компенсация кнопки с абсолютом
  overflow: scroll;
}

.item {
  width: 100%;

  & + & {
    margin-top: 8px;
  }
}

.buyer {
  @include ui-button-secondary;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 60px;

  & + & {
    margin-top: 10px;
  }
}

.profile {
  width: 100%;
}

.footer {
  position: absolute;
  right: 20px;
  bottom: 20px;
  left: 20px;
  padding-top: 10px;
  background-color: $ui-color-white;
}

.button {
  width: 100%;
  margin: 0 auto;

  & + & {

    @include exclude-md {
      margin-top: 8px;
    }

    @include md {
      margin-left: 10px;
    }
  }
}
</style>

