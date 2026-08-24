<script setup lang="ts">
const props = defineProps<{
  postId: string;
}>();

const emit = defineEmits<{
  close: [];
  reported: [];
}>();

type ReportReason = 'fraud' | 'prohibited' | 'spam' | 'misleading' | 'other';

const REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: 'fraud', label: 'Fraude ou burla' },
  { value: 'prohibited', label: 'Produto proibido' },
  { value: 'spam', label: 'Anúncio duplicado ou spam' },
  { value: 'misleading', label: 'Preço ou descrição enganosa' },
  { value: 'other', label: 'Outro motivo' },
];

const isOpen = ref(true);

const reason = ref<ReportReason | null>(null);
const comment = ref('');
const honeypot = ref('');

const isLoading = ref(false);
const isSent = ref(false);
const errorMessage = ref('');

watch(isOpen, (open) => {
  if (!open) emit('close');
});

const submit = async () => {
  if (isLoading.value) return;

  if (!reason.value) {
    errorMessage.value = 'Escolha o motivo da denúncia.';

    return;
  }

  if (reason.value === 'other' && comment.value.trim().length < 5) {
    errorMessage.value = 'Descreva o motivo em algumas palavras.';

    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/posts/${props.postId}/report`, {
      method: 'POST',
      body: {
        reason: reason.value,
        comment: comment.value,
        honeypot: honeypot.value,
      },
    });

    isSent.value = true;
    emit('reported');
  } catch (error: any) {
    errorMessage.value = error?.statusMessage || 'Não foi possível enviar. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UDrawer
    v-model:open="isOpen"
    direction="bottom"
  >
    <template #header>
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-semibold">Denunciar anúncio</span>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Fechar"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <div class="px-4 py-4">
        <div
          v-if="isSent"
          class="flex flex-col items-center gap-3 py-8 text-center"
        >
          <div class="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <UIcon
              name="i-lucide-check"
              class="size-6 text-primary"
            />
          </div>

          <p class="font-semibold text-highlighted">
            Denúncia enviada
          </p>

          <p class="max-w-xs text-sm text-muted">
            Obrigado por ajudar a manter o Ambo Market seguro. Vamos analisar o anúncio.
          </p>

          <UButton
            label="Fechar"
            color="neutral"
            variant="soft"
            class="mt-2"
            @click="isOpen = false"
          />
        </div>

        <div
          v-else
          class="flex flex-col gap-4"
        >
          <p class="text-sm text-muted">
            Este anúncio parece suspeito ou viola as regras? Diga-nos porquê.
          </p>

          <URadioGroup
            v-model="reason"
            :items="REASON_OPTIONS"
            valueKey="value"
            labelKey="label"
          />

          <UFormField
            :label="reason === 'other' ? 'Detalhes' : 'Detalhes (opcional)'"
          >
            <UTextarea
              v-model="comment"
              :rows="3"
              :maxrows="6"
              autoresize
              maxlength="1000"
              placeholder="O que há de errado com este anúncio?"
              class="w-full"
            />
          </UFormField>

          <div
            aria-hidden="true"
            class="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <label>
              Não preencha este campo
              <input
                v-model="honeypot"
                type="text"
                tabindex="-1"
                autocomplete="off"
              >
            </label>
          </div>

          <p
            v-if="errorMessage"
            class="text-sm text-error"
            v-text="errorMessage"
          />
        </div>
      </div>
    </template>

    <template
      v-if="!isSent"
      #footer
    >
      <div class="px-4 pb-4">
        <UButton
          label="Enviar denúncia"
          color="error"
          block
          :loading="isLoading"
          @click="submit"
        />
      </div>
    </template>
  </UDrawer>
</template>
