<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  error: { statusCode?: number; message?: string } | null;
}>();

const errorMessage = computed(() => props.error?.message || t('error_occurred'));
const errorCode = computed(() => (props.error?.statusCode || 500));

const is404Page = computed(() => errorCode.value === 404);

useHead({
  title: errorMessage.value,
});
</script>

<i18n>
{
  "en": {
    "error_occurred": "An error has occurred",
    "404": {
      "message": "Page doesn't exist :(",
      "text": "Unfortunately, there is no such page, but you can always find what you need, go to all ads or add your own!"
    },
    "go_to_homepage": "Go to homepage"
  },
  "pt": {
    "error_occurred": "Ocorreu um erro",
    "404": {
      "message": "A página não existe :(",
      "text": "Lamentavelmente, essa página não existe, mas você sempre pode encontrar o que precisa, ir para todos os anúncios ou adicionar o seu!"
    },
    "go_to_homepage": "Ir para a página inicial"
  }
}
</i18n>

<template>
  <div :class="$style.page">
    <div :class="$style.root">
      <h1
        :class="$style.title"
        v-text="errorCode"
      />

      <template v-if="is404Page">
        <p
          :class="$style.message"
          v-text="t('404.message')"
        />

        <p
          :class="$style.text"
          v-text="t('404.text')"
        />
      </template>

      <p
        v-else
        :class="$style.text"
        v-text="errorMessage"
      />

      <NuxtLink
        to="/"
        :class="$style.button"
      >
        {{ t('go_to_homepage') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" module>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  height: 100%;
  padding: 20px;
  text-align: center;
  background-color: #FAFAFA;
}

.title {
  color: $ui-color-text-main;
  font-weight: bold;
  font-size: 200px;
  line-height: 240px;
  opacity: .3;

  @include sm {
    font-size: 140px;
    line-height: 200px;
  }
}

.message {
  @include ui-typo-18-bold;
  color: $ui-color-black;
}

.text {
  @include ui-typo-14;
  margin-top: 20px;
  margin-bottom: 30px;
  color: $ui-color-text-main;
}

.button {
  @include ui-button-primary;

  @include sm {
    width: 100%;
  }
}
</style>
