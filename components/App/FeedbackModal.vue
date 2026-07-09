<script setup lang="ts">
import { useFeedback, type FeedbackType } from '~/composables/useFeedback';


const { isOpen, initialType, closeFeedback } = useFeedback();
const route = useRoute();

const TYPE_OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: 'idea', label: 'Sugestão' },
  { value: 'bug', label: 'Algo não funciona' },
  { value: 'complaint', label: 'Reclamação' },
  { value: 'other', label: 'Outro' },
];

const type = ref<FeedbackType>('idea');
const message = ref('');
const contact = ref('');
const honeypot = ref(''); // ловушка для ботов, скрыта от людей

const isLoading = ref(false);
const isSent = ref(false);
const errorMessage = ref('');

const resetForm = () => {
  type.value = initialType.value;
  message.value = '';
  contact.value = '';
  honeypot.value = '';
  isSent.value = false;
  errorMessage.value = '';
};

watch(isOpen, (open) => {
  if (open) resetForm();
});

const submit = async () => {
  if (isLoading.value) return;

  if (message.value.trim().length < 5) {
    errorMessage.value = 'Escreva pelo menos algumas palavras.';

    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        message: message.value,
        contact: contact.value,
        type: type.value,
        pageUrl: route.fullPath,
        honeypot: honeypot.value,
      },
    });

    isSent.value = true;
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
        <span class="font-semibold">Deixe a sua opinião</span>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Fechar"
          @click="closeFeedback"
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
            Obrigado pela sua mensagem!
          </p>

          <p class="max-w-xs text-sm text-muted">
            A sua opinião ajuda-nos a melhorar o Ambo Market.
          </p>

          <UButton
            label="Fechar"
            color="neutral"
            variant="soft"
            class="mt-2"
            @click="closeFeedback"
          />
        </div>

        <div
          v-else
          class="flex flex-col gap-4"
        >
          <p class="text-sm text-muted">
            Encontrou um problema, tem uma ideia ou sugestão? Escreva-nos — lemos tudo.
          </p>

          <UFormField label="Assunto">
            <USelect
              v-model="type"
              :items="TYPE_OPTIONS"
              valueKey="value"
              labelKey="label"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Mensagem">
            <UTextarea
              v-model="message"
              :rows="4"
              :maxrows="8"
              autoresize
              placeholder="Conte-nos o que aconteceu ou o que gostaria de ver..."
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Como podemos responder-lhe? (opcional)"
            help="Email, telefone ou WhatsApp — só se quiser que entremos em contacto."
          >
            <UInput
              v-model="contact"
              placeholder="Ex: +244 923 000 000"
              class="w-full"
            />
          </UFormField>

          <!-- honeypot: скрыто от людей, боты заполняют -> запрос отбрасывается -->
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
          label="Enviar"
          block
          :loading="isLoading"
          @click="submit"
        />
      </div>
    </template>
  </UDrawer>
</template>
