<script setup lang="ts">
import type { BuyerData, PostData, BuyersModalProps } from '~/components/Product/BuyersModal/types';


const props = defineProps<BuyersModalProps>();


const { t } = useI18n();

const isLoading = ref(true);

const post = ref<PostData | null>(null);

const selectBuyer = () => {
  isLoading.value = true;

  try {
    // const response = await https('closePost', { postId: props.postId });
    // post.value = response?.post || null;
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


onMounted(selectBuyer);
</script>

<i18n lang="json">
{
  "en": {
    "closed": "Ad removed from publication"
  },
  "pt": {
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
        v-else
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

