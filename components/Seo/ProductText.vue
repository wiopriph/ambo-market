<script setup lang="ts">
const props = defineProps<{
  productTitle: string;
  category: string;
  price: string | number;
  city: string;
  seller: string;
  productList?: string[];
}>();

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "title": "{title} – Buy & Sell on Ambo Market",
    "intro": "Looking for {title} in {city}? This is your chance to get a great deal! On Ambo Market, you can easily find and purchase {title} from trusted sellers.",
    "listing_details": "Listing Details",
    "detail_category": "Category: {category}",
    "detail_price": "Price: {price}",
    "detail_location": "Location: {city}",
    "detail_contact": "Contact: {seller}",
    "why_buy": "Why Buy {category} from Ambo Market?",
    "point_1_title": "Free & Convenient Marketplace",
    "point_1_desc": "Ambo Market allows you to browse thousands of listings for free.",
    "point_1_options": "Whether you're searching for {options} or something else, you'll find multiple options in one place.",
    "point_2_title": "Verified & Real Sellers",
    "point_2_desc": "Every listing is published by real users. You can communicate directly with the seller before making a decision.",
    "point_3_title": "Local Deals & Easy Negotiation",
    "point_3_desc": "Find {title} in {city} near you! Contact the seller, negotiate the price, and arrange a meeting at your convenience.",
    "point_4_title": "Safe Transactions",
    "point_4_desc": "Always meet in public places, inspect the item before payment, and confirm all details with the seller.",
    "contact_title": "How to Contact the Seller?",
    "contact_desc": "Interested in {title}? Reach out using the contact details in the listing or send a message directly through Ambo Market.",
    "sell_title": "Want to Sell Your Own Items? Post a Free Ad Now!",
    "sell_desc": "If you have a {category} item to sell, list it on Ambo Market for free in minutes.",
    "step_1": "Sign up or log in to your Ambo Market account.",
    "step_2": "Click 'Post an Ad' and choose the correct category.",
    "step_3": "Upload high-quality images, write a clear description, and set a fair price.",
    "step_4": "Provide contact details so potential buyers can reach out.",
    "step_5": "Publish your listing and start receiving offers!",
    "final": "Join thousands of users buying and selling {title} every day on Ambo Market.",
    "start_now": "Start browsing today and find the best {category} deals in {city}!"
  },
  "pt": {
    "title": "{title} – Compre & Venda no Ambo Market",
    "intro": "Procurando {title} em {city}? No Ambo Market, você pode encontrar e comprar {title} de vendedores confiáveis.",
    "listing_details": "Detalhes do Anúncio",
    "detail_category": "Categoria: {category}",
    "detail_price": "Preço: {price}",
    "detail_location": "Localização: {city}",
    "detail_contact": "Contato: {seller}",
    "why_buy": "Por que Comprar {category} no Ambo Market?",
    "point_1_title": "Plataforma Gratuita e Conveniente",
    "point_1_desc": "O Ambo Market permite que você navegue por milhares de anúncios sem nenhum custo.",
    "point_1_options": "Se você está procurando {options}, encontrará diversas alternativas em um só lugar.",
    "point_2_title": "Vendedores Reais e Confiáveis",
    "point_2_desc": "Todos os anúncios são publicados por usuários reais. Você pode entrar em contato diretamente com o vendedor antes de decidir.",
    "point_3_title": "Negociação Fácil e Compras Locais",
    "point_3_desc": "Encontre {title} em {city} perto de você! Fale com o vendedor, negocie o preço e combine um ponto de encontro.",
    "point_4_title": "Transações Seguras",
    "point_4_desc": "Prefira se encontrar em locais públicos, verifique o item antes de pagar e confirme todos os detalhes.",
    "contact_title": "Como Entrar em Contato com o Vendedor?",
    "contact_desc": "Interessado em {title}? Entre em contato pelos detalhes do anúncio ou envie uma mensagem pelo Ambo Market.",
    "sell_title": "Quer Vender Seus Próprios Itens? Publique um Anúncio Grátis!",
    "sell_desc": "Se você tem um item da categoria {category} para vender, publique gratuitamente em minutos.",
    "step_1": "Cadastre-se ou faça login na sua conta do Ambo Market.",
    "step_2": "Clique em 'Publicar Anúncio' e escolha a categoria correta.",
    "step_3": "Envie fotos de alta qualidade, escreva uma descrição e defina um preço justo.",
    "step_4": "Informe seus dados de contato para que os interessados possam falar com você.",
    "step_5": "Publique o anúncio e comece a receber propostas!",
    "final": "Junte-se a milhares de usuários que compram e vendem {title} todos os dias no Ambo Market.",
    "start_now": "Comece agora e encontre as melhores ofertas de {category} em {city}!"
  }
}
</i18n>

<template>
  <div class="space-y-3 text-sm leading-6 text-muted">
    <h3
      class="text-base font-semibold text-highlighted"
      v-text="t('title', { title: productTitle })"
    />

    <p v-text="t('intro', { title: productTitle, city, category })" />

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="t('listing_details')"
    />

    <ul class="list-disc space-y-1 pl-5">
      <li v-text="t('detail_category', { category })" />

      <li v-text="t('detail_price', { price })" />

      <li v-text="t('detail_location', { city })" />

      <li v-text="t('detail_contact', { seller })" />
    </ul>

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="t('why_buy', { category })"
    />

    <ol class="list-decimal space-y-3 pl-5">
      <li>
        <p
          class="font-medium text-highlighted"
          v-text="t('point_1_title')"
        />

        <p v-text="t('point_1_desc')" />

        <p
          v-if="productList?.length > 1"
          v-text="t('point_1_options', { options: productList.join(', ') })"
        />
      </li>

      <li>
        <p
          class="font-medium text-highlighted"
          v-text="t('point_2_title')"
        />

        <p v-text="t('point_2_desc')" />
      </li>

      <li>
        <p
          class="font-medium text-highlighted"
          v-text="t('point_3_title')"
        />

        <p v-text="t('point_3_desc', { title: productTitle, city })" />
      </li>

      <li>
        <p
          class="font-medium text-highlighted"
          v-text="t('point_4_title')"
        />

        <p v-text="t('point_4_desc')" />
      </li>
    </ol>

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="t('contact_title')"
    />

    <p v-text="t('contact_desc', { title: productTitle })" />

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="t('sell_title')"
    />

    <p v-text="t('sell_desc', { category })" />

    <ol class="list-decimal space-y-1 pl-5">
      <li v-text="t('step_1')" />

      <li v-text="t('step_2')" />

      <li v-text="t('step_3')" />

      <li v-text="t('step_4')" />

      <li v-text="t('step_5')" />
    </ol>

    <p v-text="t('final', { title: productTitle })" />

    <p v-text="t('start_now', { category, city })" />
  </div>
</template>
