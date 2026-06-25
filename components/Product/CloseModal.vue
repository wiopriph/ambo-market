<script setup lang="ts">
const props = defineProps<{
  postId: string;
}>();


const emit = defineEmits(['changeStatus', 'close']);

const close = () => emit('close');

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

    backendError.value = statusMessage || 'Não foi possível fechar o anúncio. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UModal
    open
    title="Fechar anúncio"
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
          title="Anúncio removido da publicação"
        />

        <template v-else>
          <p
            class="text-sm text-toned"
            v-text="'Tem certeza de que deseja fechar este anúncio?'"
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
          label="OK"
          color="primary"
          block
          class="sm:w-auto"
          @click="close"
        />

        <template v-else>
          <UButton
            label="Sim, fechar"
            :loading="isLoading"
            color="primary"
            block
            class="sm:w-auto"
            @click="closePost"
          />

          <UButton
            label="Não, manter"
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
