<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';


const title = 'Definir nova senha do Ambo Market';
const description = 'Crie uma nova senha para sua conta Ambo Market e recupere o acesso seguro aos seus classificados.';

useHead({
  title,
  meta: [
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'description', name: 'description', content: description },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:description', property: 'twitter:description', content: description },
  ],
});

const route = useRoute();
const client = useSupabaseClient();
const { updateUser } = useAuth();

const isCheckingToken = ref(true);
const isTokenInvalid = ref(false);

const isLoading = ref(false);
const backendError = ref('');
const successMessage = ref('');

onMounted(async () => {
  const { data, error } = await client.auth.verifyOtp({
    ['token_hash']: route.query.token,
    type: route.query.type,
  });

  if (error || !data.user) {
    isTokenInvalid.value = true;
  }

  isCheckingToken.value = false;
});

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: { password: '', confirmPassword: '' },
  validationSchema: object({
    password: string()
      .required('A senha não pode estar vazia')
      .min(6, 'A senha é muito curta')
      .max(20, 'A senha é muito longa'),
    confirmPassword: string()
      .required('Este campo é obrigatório')
      .when('password', {
        is: () => !arePasswordsEqual.value,
        then: schema => schema
          .test('password-match', 'As senhas não coincidem', value => value === password.value),
      }),
  }),
});

const arePasswordsEqual = computed(() => !!password.value && (password.value === confirmPassword.value));

const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const submitNewPassword = handleSubmit.withControlled(async () => {
  if (isLoading.value || isTokenInvalid.value) return;

  backendError.value = '';
  successMessage.value = '';
  isLoading.value = true;

  const { error } = await updateUser({ password: password.value });

  isLoading.value = false;

  if (error) {
    backendError.value = error.message || 'Error';

    return;
  }

  successMessage.value = 'Sua senha foi atualizada. Agora você pode entrar com a nova senha.';
});

const goToLogin = () => {
  navigateTo({
    name: 'auth',
    query: { redirect: route.query.redirect as string },
  });
};
</script>

<template>
  <div
    v-if="isCheckingToken"
    class="flex justify-center py-12"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-8 animate-spin text-muted"
    />
  </div>

  <div
    v-else
    class="mx-auto w-full max-w-md px-4 py-8 sm:py-16 space-y-3"
  >
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        {{ isTokenInvalid ? 'O link é inválido ou expirou' : 'Definir uma nova senha' }}
      </h1>

      <p
        v-if="!isTokenInvalid"
        class="mt-0.5 text-sm text-muted"
      >
        Digite uma nova senha para sua conta.
      </p>
    </div>

    <template v-if="isTokenInvalid">
      <UAlert
        color="warning"
        variant="soft"
        icon="i-lucide-triangle-alert"
        description="Solicite um novo link de redefinição de senha e tente novamente."
      />

      <div class="flex justify-center">
        <UButton
          type="button"
          color="primary"
          variant="link"
          size="sm"
          class="px-0"
          @click="goToLogin"
        >
          Voltar para login
        </UButton>
      </div>
    </template>

    <template v-else>
      <form
        class="space-y-3"
        @submit.prevent="submitNewPassword"
      >
        <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
          <div class="px-5 py-4">
            <UFormField
              label="Nova senha"
              :error="errors.password"
              name="password"
              required
            >
              <UInput
                v-model="password"
                name="password"
                type="password"
                autocomplete="new-password"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="px-5 py-4">
            <UFormField
              label="Confirmar senha"
              :error="errors.confirmPassword"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <UAlert
          v-if="backendError"
          color="error"
          variant="soft"
          icon="i-lucide-circle-alert"
          :description="backendError"
        />

        <UAlert
          v-if="successMessage"
          color="success"
          variant="soft"
          icon="i-lucide-circle-check"
          :description="successMessage"
        />

        <UButton
          type="submit"
          label="Salvar nova senha"
          :loading="isLoading"
          size="lg"
          block
        />
      </form>

      <div class="flex justify-center">
        <UButton
          type="button"
          color="primary"
          variant="link"
          size="sm"
          class="px-0"
          @click="goToLogin"
        >
          Voltar para login
        </UButton>
      </div>
    </template>
  </div>
</template>
