<script setup lang="ts">
import type { SeoCategoryTextProps } from './types';
import { getCityById } from '~/constants/cities';


const props = defineProps<SeoCategoryTextProps>();

const cityName = computed(() => {
  const city = getCityById(props.cityId);

  return city ? city.name : '';
});

const { t } = useI18n();

const categoryName = computed(() => t(props.categoryId));
</script>

<i18n>
{
  "en": {
    "title": "{title} – Free Listings on Ambo Market",
    "intro": "If you are looking for {category} in {city}, you are in the right place! On Ambo Market, you can easily buy, sell, or exchange {category} at no extra cost. Post free ads, find great deals, and save time searching for the products or services you need.",
    "intro_everywhere": "If you are looking for {category} in Angola, you are in the right place! On Ambo Market, you can easily buy, sell, or exchange {category} at no extra cost. Post free ads, find great deals, and save time searching for the products or services you need.",
    "why_choose": "Why Ambo Market?",
    "free_listings": "Free Listings",
    "free_listings_desc": "Ambo Market is a platform where anyone can post an ad for free and quickly find buyers. Simply create a listing, add photos, set your price, and wait for responses!",
    "wide_selection": "Wide Selection of {category}",
    "wide_selection_desc": "Our platform features thousands of listings from private sellers and businesses.",
    "you_can_find": "You can find {options} at affordable prices.",
    "easy_search": "Easy Search and Filters",
    "easy_search_desc": "We understand how important it is to find what you need quickly. Use our filters to sort by price, condition, location, and other criteria to find the perfect match.",
    "safe_transactions": "Safe Transactions",
    "safe_transactions_desc": "Buying and selling through classified ads can be simple and secure if you follow basic safety rules: meet in public places, inspect the product before payment, and communicate clearly with buyers or sellers.",
    "how_to_post": "How to Post an Ad for {category} in {city}?",
    "how_to_post_everywhere": "How to Post an Ad for {category}?",
    "how_to_post_steps": {
      "step_1": "Sign up or log in to your Ambo Market account.",
      "step_2": "Click 'Post an Ad' and choose '{category}'.",
      "step_3": "Add a detailed description, high-quality photos, and a fair price.",
      "step_4": "Provide contact details so potential buyers can reach you.",
      "step_5": "Publish your listing and start receiving offers!"
    },
    "best_deals": "Find the Best Deals on {category} Today!",
    "best_deals_desc": "Don't miss out on the best deals for {category} in {city}. Browse listings, compare prices, and contact sellers directly. Whether you're looking for new or used {category}, Ambo Market is the best place to buy and sell!",
    "best_deals_desc_everywhere": "Don't miss out on the best deals for {category} in Angola. Browse listings, compare prices, and contact sellers directly. Whether you're looking for new or used {category}, Ambo Market is the best place to buy and sell!",
    "start_now": "Start your search now and discover amazing offers on {category} in {city}!",
    "start_now_everywhere": "Start your search now and discover amazing offers on {category} in Angola!"
  },
  "pt": {
    "title": "{title} – Anúncios Gratuitos no Ambo Market",
    "intro": "Se você está procurando {category} em {city}, chegou ao lugar certo! No Ambo Market, você pode comprar, vender ou trocar {category} sem custos adicionais. Publique anúncios gratuitos, encontre ótimas ofertas e economize tempo na busca pelos produtos ou serviços que você precisa.",
    "intro_everywhere": "Se você está procurando {category} em Angola, chegou ao lugar certo! No Ambo Market, você pode comprar, vender ou trocar {category} sem custos adicionais. Publique anúncios gratuitos, encontre ótimas ofertas e economize tempo na busca pelos produtos ou serviços que você precisa.",
    "why_choose": "Por que Ambo Market?",
    "free_listings": "Anúncios Gratuitos",
    "free_listings_desc": "O Ambo Market é uma plataforma onde qualquer pessoa pode publicar um anúncio gratuitamente e encontrar compradores rapidamente. Basta criar um anúncio, adicionar fotos, definir o preço e aguardar os contatos!",
    "wide_selection": "Grande Variedade de {category}",
    "wide_selection_desc": "Nosso site conta com milhares de anúncios de vendedores particulares e empresas.",
    "you_can_find": "Você pode encontrar {options} a preços acessíveis.",
    "easy_search": "Pesquisa e Filtros Fáceis de Usar",
    "easy_search_desc": "Sabemos como é importante encontrar o que você precisa rapidamente. Utilize nossos filtros para classificar por preço, estado, localização e outros critérios para encontrar a melhor opção.",
    "safe_transactions": "Transações Seguras",
    "safe_transactions_desc": "Comprar e vender por meio de anúncios classificados pode ser simples e seguro se você seguir algumas regras básicas: marque encontros em locais públicos, verifique o produto antes de pagar e mantenha uma comunicação clara com compradores ou vendedores.",
    "how_to_post": "Como Publicar um Anúncio de {category} em {city}?",
    "how_to_post_everywhere": "Como Publicar um Anúncio de {category}?",
    "how_to_post_steps": {
      "step_1": "Cadastre-se ou faça login na sua conta do Ambo Market.",
      "step_2": "Clique em 'Publicar Anúncio' e escolha '{category}'.",
      "step_3": "Adicione uma descrição detalhada, fotos de alta qualidade e um preço justo.",
      "step_4": "Informe seus dados de contato para que os interessados possam falar com você.",
      "step_5": "Publique seu anúncio e comece a receber propostas!"
    },
    "best_deals": "Encontre as Melhores Ofertas de {category} Hoje Mesmo!",
    "best_deals_desc": "Não perca as melhores ofertas de {category} em {city}. Navegue pelos anúncios, compare preços e fale diretamente com os vendedores. Seja para comprar {category} novo ou usado, o Ambo Market é o melhor lugar para comprar e vender!",
    "best_deals_desc_everywhere": "Não perca as melhores ofertas de {category} em Angola. Navegue pelos anúncios, compare preços e fale diretamente com os vendedores. Seja para comprar {category} novo ou usado, o Ambo Market é o melhor lugar para comprar e vender!",
    "start_now": "Comece sua busca agora e descubra ofertas incríveis de {category} em {city}!",
    "start_now_everywhere": "Comece sua busca agora e descubra ofertas incríveis de {category} em Angola!"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h3>
      {{ t('title', { title: props.title }) }}
    </h3>

    <p>
      {{ cityId === 'all' ? t('intro_everywhere', { category: categoryName }) : t('intro', { category: categoryName, city: cityName }) }}
    </p>

    <h3 v-text="t('why_choose')" />

    <ol>
      <li>
        <p v-text="t('free_listings')" />

        <p v-text="t('free_listings_desc')" />
      </li>

      <li>
        <p v-text="t('wide_selection', { category: categoryName })" />


        <p v-if="productList">
          {{ t('wide_selection_desc') }}
          {{ productList?.length > 1 ? t('you_can_find', { options: productList.join(', ') }) : '' }}
        </p>
      </li>

      <li>
        <p v-text="t('easy_search')" />

        <p v-text="t('easy_search_desc')" />
      </li>

      <li>
        <p v-text="t('safe_transactions')" />

        <p v-text="t('safe_transactions_desc')" />
      </li>
    </ol>

    <h3>
      {{ cityId === 'all' ? t('how_to_post_everywhere', { category: categoryName }) : t('how_to_post', { category: categoryName, city: cityName }) }}
    </h3>

    <ol>
      <li>
        <p v-text="t('how_to_post_steps.step_1')" />
      </li>

      <li>
        <p v-text="t('how_to_post_steps.step_2', { category: categoryName })" />
      </li>

      <li>
        <p v-text="t('how_to_post_steps.step_3')" />
      </li>

      <li>
        <p v-text="t('how_to_post_steps.step_4')" />
      </li>

      <li>
        <p v-text="t('how_to_post_steps.step_5')" />
      </li>
    </ol>

    <h3 v-text="t('best_deals', { category: categoryName })" />

    <p>
      {{ cityId === 'all' ? t('best_deals_desc_everywhere', { category: categoryName }) : t('best_deals_desc', { category: categoryName, city: cityName }) }}
    </p>

    <p>
      {{ cityId === 'all' ? t('start_now_everywhere', { category: categoryName }) : t('start_now', { category: categoryName, city: cityName }) }}
    </p>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-typo-14;

  h3 {
    @include ui-typo-18-bold;

    margin-top: 16px;
  }

  p {
    margin-top: 8px;
  }

  ol {
    padding-left: 16px;
  }
}
</style>
