<script setup lang="ts">
const { t, tm, rt } = useI18n();

const paragraphs = computed(() => (tm('paragraphs') as unknown[]).map(paragraph => rt(paragraph)));

const values = computed(() => [
  { icon: 'i-lucide-zap', label: t('value_simple'), text: t('value_simple_text') },
  { icon: 'i-lucide-shield-check', label: t('value_safe'), text: t('value_safe_text') },
  { icon: 'i-lucide-users', label: t('value_open'), text: t('value_open_text') },
]);

useHead({
  title: t('meta_title'),
  meta: [
    { key: 'description', name: 'description', content: t('meta_description') },
    { key: 'og:title', property: 'og:title', content: t('meta_title') },
    { key: 'og:description', property: 'og:description', content: t('meta_description') },
    { key: 'twitter:title', property: 'twitter:title', content: t('meta_title') },
    { key: 'twitter:description', property: 'twitter:description', content: t('meta_description') },
  ],
});
</script>

<i18n lang="json">
{
  "en": {
    "meta_title": "About Ambo Market – Our Mission and Story",
    "meta_description": "Learn about Ambo Market — a simple, safe, and open marketplace built for everyday people in Angola and emerging markets.",
    "title": "About Ambo",
    "paragraphs": [
      "We believe online commerce should be simple, safe, and open to everyone.",
      "Ambo was built by a team that loves creating useful products and solving real-world problems. We are not a large corporation — we're builders who want to make buying and selling easier for everyday people.",
      "Our mission is to create a marketplace where individuals and businesses can connect, trade, and grow with confidence. We focus on simplicity, transparency, and trust because these are the foundations of every successful transaction.",
      "We're inspired by the world's best marketplaces, but we're building Ambo for the realities of local communities and emerging markets.",
      "Every feature we create has one purpose: helping people buy and sell more easily, more safely, and with less friction.",
      "We're just getting started."
    ],
    "value_simple": "Simple",
    "value_simple_text": "No clutter. Post an ad in minutes, find what you need fast.",
    "value_safe": "Safe",
    "value_safe_text": "Verified sellers, transparent listings, and real community trust.",
    "value_open": "Open to all",
    "value_open_text": "For individuals and businesses across Angola and beyond."
  },
  "pt": {
    "meta_title": "Sobre a Ambo Market – Nossa Missão e História",
    "meta_description": "Conheça a Ambo Market — um marketplace simples, seguro e aberto para pessoas comuns em Angola e mercados emergentes.",
    "title": "Sobre a Ambo",
    "paragraphs": [
      "Acreditamos que o comércio online deve ser simples, seguro e aberto a todos.",
      "A Ambo foi criada por uma equipe que gosta de construir produtos úteis e resolver problemas reais. Não somos uma grande corporação — somos construtores que querem tornar a compra e venda mais fácil para pessoas comuns.",
      "A nossa missão é criar um marketplace onde pessoas e empresas possam se conectar, negociar e crescer com confiança. Focamos em simplicidade, transparência e confiança porque estes são os fundamentos de toda transação bem-sucedida.",
      "Somos inspirados pelos melhores marketplaces do mundo, mas estamos construindo a Ambo para a realidade das comunidades locais e dos mercados emergentes.",
      "Cada funcionalidade que criamos tem um propósito: ajudar as pessoas a comprar e vender com mais facilidade, mais segurança e menos atrito.",
      "Estamos apenas começando."
    ],
    "value_simple": "Simples",
    "value_simple_text": "Sem complicação. Publique um anúncio em minutos e encontre o que precisa rápido.",
    "value_safe": "Seguro",
    "value_safe_text": "Vendedores verificados, anúncios transparentes e confiança real na comunidade.",
    "value_open": "Aberto a todos",
    "value_open_text": "Para pessoas e empresas em Angola e além."
  }
}
</i18n>

<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-5 py-10 sm:py-16 space-y-10">
    <div class="space-y-4">
      <h1
        class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
        v-text="t('title')"
      />

      <p
        class="text-base leading-relaxed text-muted"
        v-text="paragraphs[0]"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div
        v-for="value in values"
        :key="value.icon"
        class="rounded-2xl border border-default bg-default p-4 space-y-2"
      >
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <UIcon
            :name="value.icon"
            class="size-4 text-primary"
          />
        </div>

        <p
          class="text-sm font-semibold text-highlighted"
          v-text="value.label"
        />

        <p
          class="text-xs text-muted leading-relaxed"
          v-text="value.text"
        />
      </div>
    </div>

    <div class="space-y-5 border-l-2 border-default pl-5">
      <p
        v-for="(paragraph, index) in paragraphs.slice(1, -1)"
        :key="index"
        class="text-sm leading-7 text-toned sm:text-base"
        v-text="paragraph"
      />
    </div>

    <p
      class="text-sm font-medium text-primary"
      v-text="paragraphs[paragraphs.length - 1]"
    />
  </div>
</template>
