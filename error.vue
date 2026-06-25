<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  error: { statusCode?: number; message?: string } | null;
}>();

const errorCode = computed(() => props.error?.statusCode || 500);
const is404 = computed(() => errorCode.value === 404);

useHead({ title: is404.value ? t('404.message') : (props.error?.message || t('error_occurred')) });
</script>

<i18n>
{
  "en": {
    "error_occurred": "An error has occurred",
    "404": {
      "message": "Page not found",
      "text": "This page doesn't exist, but you can always find what you need on the homepage."
    },
    "go_to_homepage": "Go to homepage"
  },
  "pt": {
    "error_occurred": "Ocorreu um erro",
    "404": {
      "message": "Página não encontrada",
      "text": "Essa página não existe, mas você sempre pode encontrar o que precisa na página inicial."
    },
    "go_to_homepage": "Ir para a página inicial"
  }
}
</i18n>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="text-[160px] font-bold leading-none text-muted/20 sm:text-[120px]">
      {{ errorCode }}
    </p>

    <h1 class="mt-4 text-xl font-semibold text-highlighted">
      {{ is404 ? t('404.message') : t('error_occurred') }}
    </h1>

    <p class="mt-2 max-w-sm text-sm text-muted">
      {{ is404 ? t('404.text') : props.error?.message }}
    </p>

    <UButton
      to="/"
      class="mt-8"
      size="lg"
      :label="t('go_to_homepage')"
    />
  </div>
</template>
