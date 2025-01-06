<script setup lang="ts">
import type { RatingCreateProps } from './types';


const props = defineProps<RatingCreateProps>();


const isRateModalVisible = ref(false);

const showRateModal = () => {
  isRateModalVisible.value = true;
};

const hideRateModal = () => {
  isRateModalVisible.value = false;
};

const formattedUserName = computed(() => props.userName || `User_${props.userId.slice(0, 4)}`);

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "confirms": "{name} confirms that you have purchased this item",
    "rate": "Rate"
  },
  "pt": {
    "confirms": "{name} confirma que você comprou este item",
    "rate": "Avaliar"
  }
}
</i18n>

<template>
  <div>
    <div :class="$style.rate">
      <span
        :class="$style.text"
        v-text="t('confirms',{ name: formattedUserName })"
      />

      <UIButton
        :text="t('rate')"
        :class="$style.rateButton"
        @click="showRateModal"
      />
    </div>

    <RatingCreateModal
      v-if="isRateModalVisible"
      :userId="userId"
      :userName="userName"
      :userPhoto="userPhoto"
      :postId="postId"
      @close="hideRateModal"
    />
  </div>
</template>

<style lang="scss" module>
.rate {
  @include ui-round-content-blocks;

  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 260px;
  margin: 0 auto;
  padding: 20px;
  background-color: #FAFAFA;
}

.text {
  margin-bottom: 20px;
  text-align: center;
}

.rateButton {
  width: 100%;
}
</style>
