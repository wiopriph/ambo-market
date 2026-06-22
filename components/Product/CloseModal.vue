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
  <UModal
    open
    :title="t('title')"
    :ui="{ content: 'max-w-md' }"
    @update:open="(value) => !value && close()"
  >
    <template #body>
      <div class="space-y-4">
        <div
          v-if="isLoading"
          class="flex items-center justify-center py-8"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-6 animate-spin text-primary"
          />
        </div>

        <UAlert
          v-else-if="isSuccess"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          :title="t('closed')"
        />

        <template v-else>
          <p
            class="text-sm text-toned"
            v-text="t('question')"
          />

          <UAlert
            v-if="backendError"
            color="error"
            variant="soft"
            icon="i-lucide-circle-alert"
            :title="backendError"
          />
        </template>
      </div>
    </template>

    <template #footer>
      <div class="grid w-full gap-2 sm:flex sm:justify-end">
        <UButton
          v-if="isSuccess"
          :label="t('ok')"
          color="primary"
          block
          class="sm:w-auto"
          @click="close"
        />

        <template v-else>
          <UButton
            :label="t('yes')"
            :loading="isLoading"
            color="primary"
            block
            class="sm:w-auto"
            @click="closePost"
          />

          <UButton
            :label="t('no')"
            :disabled="isLoading"
            color="neutral"
            variant="soft"
            block
            class="sm:w-auto"
            @click="close"
          />
        </template>
      </div>
    </template>
  </UModal>
</template>
