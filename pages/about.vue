<script setup lang="ts">
const metaTitle = 'Sobre a Ambo Market – Marketplace de Classificados Nº 1 em Angola';
const metaDescription = 'A Ambo Market é o marketplace de classificados gratuito em Angola: compre e venda carros, imóveis, electrónicos e muito mais. Simples, seguro e para todos.';

const paragraphs = [
  'Acreditamos que o comércio online deve ser simples, seguro e aberto a todos.',
  'A Ambo foi criada por uma equipe que gosta de construir produtos úteis e resolver problemas reais. Não somos uma grande corporação — somos construtores que querem tornar a compra e venda mais fácil para pessoas comuns.',
  'A nossa missão é criar um marketplace onde pessoas e empresas possam se conectar, negociar e crescer com confiança. Focamos em simplicidade, transparência e confiança porque estes são os fundamentos de toda transação bem-sucedida.',
  'Somos inspirados pelos melhores marketplaces do mundo, mas estamos construindo a Ambo para a realidade das comunidades locais e dos mercados emergentes.',
  'Cada funcionalidade que criamos tem um propósito: ajudar as pessoas a comprar e vender com mais facilidade, mais segurança e menos atrito.',
  'Estamos apenas começando.',
];

const values = [
  {
    icon: 'i-lucide-zap',
    label: 'Simples',
    text: 'Sem complicação. Publique um anúncio em minutos e encontre o que precisa rápido.',
  },
  {
    icon: 'i-lucide-shield-check',
    label: 'Seguro',
    text: 'Vendedores verificados, anúncios transparentes e confiança real na comunidade.',
  },
  { icon: 'i-lucide-users', label: 'Aberto a todos', text: 'Para pessoas e empresas em Angola e além.' },
];

useHead({
  title: metaTitle,
  meta: [
    { key: 'description', name: 'description', content: metaDescription },
    { key: 'og:title', property: 'og:title', content: metaTitle },
    { key: 'og:description', property: 'og:description', content: metaDescription },
    { key: 'twitter:title', property: 'twitter:title', content: metaTitle },
    { key: 'twitter:description', property: 'twitter:description', content: metaDescription },
  ],
});
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-5 py-10 sm:py-16 space-y-10">
    <div class="space-y-4">
      <h1
        class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
      >
        Sobre a Ambo
      </h1>

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
