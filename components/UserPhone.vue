<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { vMaska } from 'maska/vue';
import { useUser } from '~/composables/useUser';
import { PHONE_REG_EXP } from '~/constants/reg-exps';


const { currentUser, updateProfile } = useUser();

const { errors, handleSubmit, setFieldValue } = useForm({
  initialValues: { name: '', phone: '' },
  validationSchema: object({
    name: string().required('Este campo é obrigatório'),
    phone: string()
      .required('Este campo é obrigatório')
      .matches(PHONE_REG_EXP, 'Formato incorreto do telefone'),
  }),
});

const { value: name } = useField<string>('name');
const { value: phone } = useField<string>('phone');

watch(currentUser, (user) => {
  if (!user) return;

  setFieldValue('name', user.name ?? '');
  setFieldValue('phone', user.phone ?? '');
}, { immediate: true });

const isLoading = ref(false);
const backendError = ref('');

const saveProfile = handleSubmit.withControlled(async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  backendError.value = '';

  try {
    await updateProfile({
      'display_name': name.value.trim(),
      phone: phone.value.replace(/\s+/g, ''),
    });
  } catch (error: any) {
    backendError.value = error?.message || 'Error';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="rounded-2xl border border-default bg-default px-5 py-4 space-y-5">
    <div class="space-y-1">
      <h2 class="text-xl font-semibold text-highlighted">
        Adicionar dados de contacto
      </h2>

      <p class="text-sm text-muted">
        Os compradores precisam do seu nome e número de telefone antes de você publicar um anúncio.
      </p>
    </div>

    <form
      class="space-y-4"
      @submit.prevent="saveProfile"
    >
      <UFormField
        label="Nome"
        :error="errors.name"
        name="name"
        required
      >
        <UInput
          v-model="name"
          name="name"
          type="text"
          autocomplete="name"
          placeholder="Seu nome"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Número de telefone"
        :error="errors.phone"
        name="phone"
        required
      >
        <UInput
          v-model="phone"
          v-maska="'+244 ### ### ###'"
          name="phone"
          type="tel"
          autocomplete="tel-national"
          inputmode="tel"
          placeholder="+244 900 000 000"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="backendError"
        color="error"
        variant="soft"
        :description="backendError"
      />

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
        label="Guardar e continuar"
      />
    </form>
  </div>
</template>
