<script setup lang="ts">
const props = defineProps<{
  error: { statusCode?: number; message?: string } | null;
}>();

const errorCode = computed(() => props.error?.statusCode || 500);
const is404 = computed(() => errorCode.value === 404);

useHead({ title: is404.value ? 'Página não encontrada' : (props.error?.message || 'Ocorreu um erro') });
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="text-[160px] font-bold leading-none text-muted/20 sm:text-[120px]">
      {{ errorCode }}
    </p>

    <h1 class="mt-4 text-xl font-semibold text-highlighted">
      {{ is404 ? 'Página não encontrada' : 'Ocorreu um erro' }}
    </h1>

    <p class="mt-2 max-w-sm text-sm text-muted">
      {{
        is404 ? 'Essa página não existe, mas você sempre pode encontrar o que precisa na página inicial.' : props.error?.message
      }}
    </p>

    <UButton
      to="/"
      class="mt-8"
      size="lg"
      label="Ir para a página inicial"
    />
  </div>
</template>
