<script setup lang="ts">
const props = defineProps<{
  postId: string;
}>();


const emit = defineEmits(['changeStatus', 'close']);

const close = () => emit('close');

const { t } = useI18n();

const isLoading = ref(false);
const isSuccess = ref(false);
const backendError = ref('');

const closePost = async () => {
  if (!props.postId || isLoading.value) {
    return;
  }

  backendError.value = '';
  isLoading.value = true;

  try {
    await $fetch(`/api/posts/${props.postId}/close`, { method: 'POST' });

    isSuccess.value = true;

    emit('changeStatus');
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);

    const statusMessage =
      error?.statusMessage ??
      error?.data?.statusMessage ??
      error?.message ??
      '';

    backendError.value = statusMessage || t('error_generic');
  } finally {
    isLoading.value = false;
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Close ad",
    "question": "Are you sure you want to close this ad?",
    "closed": "Ad removed from publication",
    "yes": "Yes, close",
    "no": "No, keep it",
    "ok": "OK",
    "error_generic": "Failed to close the ad. Please try again."
  },
  "pt": {
    "title": "Fechar anúncio",
    "question": "Tem certeza de que deseja fechar este anúncio?",
    "closed": "Anúncio removido da publicação",
    "yes": "Sim, fechar",
    "no": "Não, manter",
    "ok": "OK",
    "error_generic": "Não foi possível fechar o anúncio. Tente novamente."
  }
}
</i18n>

<template>
  <UIModal
    :title="t('title')"
    maxWidth="500px"
    @close="close"
  >
    <div :class="$style.root">
      <UILoader
        v-if="isLoading"
        :class="$style.loader"
      />

      <template v-else>
        <div
          v-if="isSuccess"
          :class="$style.content"
        >
          <p
            :class="$style.text"
            v-text="t('closed')"
          />

          <UIButton
            :class="$style.button"
            :text="t('ok')"
            @click="close"
          />
        </div>

        <div
          v-else
          :class="$style.content"
        >
          <p
            :class="$style.text"
            v-text="t('question')"
          />

          <UIError
            v-if="backendError"
            :text="backendError"
          />

          <div :class="$style.buttons">
            <UIButton
              :class="$style.buttonPrimary"
              :text="t('yes')"
              :isLoading="isLoading"
              @click="closePost"
            />

            <UIButton
              :class="$style.buttonSecondary"
              :text="t('no')"
              :isDisabled="isLoading"
              type="secondary"
              @click="close"
            />
          </div>
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
  padding-top: 40px;
  padding-bottom: 40px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;


  @include md {
    justify-content: space-between;
    height: 100%;
  }
}

.text {
  @include ui-typo-18-bold;

  text-align: center;
  margin-bottom: 20px;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: row;

  @include md {
    flex-direction: column;

    justify-content: center;
  }
}

.buttonPrimary,
.buttonSecondary {
  width: 100%;

  @include md {
    width: auto;
    min-width: 140px;
  }
}

.buttonPrimary + .buttonSecondary {

  @include md {
    margin-top: 8px;
  }

  @include exclude-md {
    margin-left: 10px;
  }
}

.button {
  width: 100%;
  margin-top: 10px;
}
</style>
