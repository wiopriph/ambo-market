<script setup lang="ts">
const { t, tm, rt } = useI18n();

const paragraphs = computed(() => (tm('paragraphs') as unknown[]).map(paragraph => rt(paragraph)));
</script>

<i18n lang="json">
{
  "en": {
    "title": "About Ambo",
    "paragraphs": [
      "We believe online commerce should be simple, safe, and open to everyone.",
      "Ambo was built by a team that loves creating useful products and solving real-world problems. We are not a large corporation — we're builders who want to make buying and selling easier for everyday people.",
      "Our mission is to create a marketplace where individuals and businesses can connect, trade, and grow with confidence. We focus on simplicity, transparency, and trust because these are the foundations of every successful transaction.",
      "We're inspired by the world's best marketplaces, but we're building Ambo for the realities of local communities and emerging markets.",
      "Every feature we create has one purpose: helping people buy and sell more easily, more safely, and with less friction.",
      "We're just getting started."
    ]
  },
  "pt": {
    "title": "Sobre a Ambo",
    "paragraphs": [
      "Acreditamos que o comércio online deve ser simples, seguro e aberto a todos.",
      "A Ambo foi criada por uma equipe que gosta de construir produtos úteis e resolver problemas reais. Não somos uma grande corporação — somos construtores que querem tornar a compra e venda mais fácil para pessoas comuns.",
      "A nossa missão é criar um marketplace onde pessoas e empresas possam se conectar, negociar e crescer com confiança. Focamos em simplicidade, transparência e confiança porque estes são os fundamentos de toda transação bem-sucedida.",
      "Somos inspirados pelos melhores marketplaces do mundo, mas estamos construindo a Ambo para a realidade das comunidades locais e dos mercados emergentes.",
      "Cada funcionalidade que criamos tem um propósito: ajudar as pessoas a comprar e vender com mais facilidade, mais segurança e menos atrito.",
      "Estamos apenas começando."
    ]
  }
}
</i18n>

<template>
  <article class="mx-auto max-w-4xl space-y-5 py-4 sm:py-8">
    <h1
      class="text-3xl font-bold text-highlighted sm:text-4xl"
      v-text="t('title')"
    />

    <div class="space-y-4">
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        v-text="paragraph"
      />
    </div>
  </article>
</template>
