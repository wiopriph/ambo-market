<script setup lang="ts">
import type { SeoProductTextProps } from './types';


const props = defineProps<SeoProductTextProps>();

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "title": "{title} – Buy & Sell on Ambo Market",
    "intro": "Looking for {title} in {city}? This is your chance to get a great deal! On Ambo Market, you can easily find and purchase {title} from trusted sellers. Whether you’re looking for a {category}, this listing provides all the details you need.",
    "listing_details": "Listing Details",
    "details": {
      "category": "Category: {category}",
      "price": "Price: {price}",
      "location": "Location: {city}",
      "contact": "Contact: {seller}"
    },
    "why_buy": {
      "title": "Why Buy {category} from Ambo Market?",
      "point_1": {
        "title": "Free & Convenient Marketplace",
        "desc": "Ambo Market allows you to browse thousands of listings for free.",
        "can_find": "Whether you're searching for {options} or something else, you'll find multiple options in one place."
      },
      "point_2": {
        "title": "Verified & Real Sellers",
        "desc": "Every listing is published by real users, ensuring you’re dealing with genuine people. You can communicate directly with the seller and ask any necessary questions before making a decision."
      },
      "point_3": {
        "title": "Local Deals & Easy Negotiation",
        "desc": "Find {title} in {city} near you! Contact the seller, negotiate the price, and arrange a meeting at your convenience."
      },
      "point_4": {
        "title": "Safe Transactions",
        "desc": "To ensure a secure deal, always meet in public places, inspect the item before making payment, and confirm all details with the seller."
      }
    },
    "contact_seller": {
      "title": "How to Contact the Seller?",
      "desc": "Interested in {title}? Reach out to the seller using the contact details provided in the listing. You can send a message directly through Ambo Market or call them to get more details."
    },
    "sell_your_items": {
      "title": "Want to Sell Your Own Items? Post a Free Ad Now!",
      "desc": "If you have a {category} item to sell, don’t hesitate to list it on Ambo Market. Posting an ad is completely free and takes only a few minutes. Here’s how you can do it:",
      "steps": {
        "step_1": "Sign up or log in to your Ambo Market account.",
        "step_2": "Click 'Post an Ad' and choose the correct category.",
        "step_3": "Upload high-quality images, write a clear description, and set a fair price.",
        "step_4": "Provide contact details so potential buyers can reach out to you.",
        "step_5": "Publish your listing and start receiving offers!"
      },
      "final_message": "Join thousands of users buying and selling {title} every day on Ambo Market."
    },
    "start_now": "Start browsing today and find the best {category} deals in {city}!"
  },
  "pt": {
    "title": "{title} – Compre & Venda no Ambo Market",
    "intro": "Procurando {title} em {city}? Esta é a sua chance de conseguir um ótimo negócio! No Ambo Market, você pode encontrar e comprar {title} de vendedores confiáveis. Seja novo ou usado, este anúncio contém todas as informações que você precisa.",
    "listing_details": "Detalhes do Anúncio",
    "details": {
      "category": "Categoria: {category}",
      "price": "Preço: {price}",
      "location": "Localização: {city}",
      "contact": "Contato: {seller}"
    },
    "why_buy": {
      "title": "Por que Comprar {category} no Ambo Market?",
      "point_1": {
        "title": "Plataforma Gratuita e Conveniente",
        "desc": "O Ambo Market permite que você navegue por milhares de anúncios sem nenhum custo.",
        "can_find": "Se você está procurando {options}, encontrará diversas alternativas em um só lugar."
      },
      "point_2": {
        "title": "Vendedores Reais e Confiáveis",
        "desc": "Todos os anúncios são publicados por usuários reais, garantindo que você está lidando com pessoas legítimas. Você pode entrar em contato diretamente com o vendedor e tirar todas as suas dúvidas antes de decidir."
      },
      "point_3": {
        "title": "Negociação Fácil e Compras Locais",
        "desc": "Encontre {title} em {city} perto de você! Fale diretamente com o vendedor, negocie o preço e combine um ponto de encontro conveniente."
      },
      "point_4": {
        "title": "Transações Seguras",
        "desc": "Para garantir um negócio seguro, sempre prefira se encontrar em locais públicos, verifique o item antes de pagar e confirme todos os detalhes com o vendedor."
      }
    },
    "contact_seller": {
      "title": "Como Entrar em Contato com o Vendedor?",
      "desc": "Interessado em {title}? Entre em contato com o vendedor pelos detalhes fornecidos no anúncio. Você pode enviar uma mensagem diretamente pelo Ambo Market ou ligar para saber mais informações."
    },
    "sell_your_items": {
      "title": "Quer Vender Seus Próprios Itens? Publique um Anúncio Grátis Agora!",
      "desc": "Se você tem um item da categoria {category} para vender, não perca tempo! O Ambo Market permite que você publique anúncios totalmente grátis em apenas alguns minutos. Veja como:",
      "steps": {
        "step_1": "Cadastre-se ou faça login na sua conta do Ambo Market.",
        "step_2": "Clique em 'Publicar Anúncio' e escolha a categoria correta.",
        "step_3": "Envie fotos de alta qualidade, escreva uma descrição detalhada e defina um preço justo.",
        "step_4": "Informe seus dados de contato para que os interessados possam falar com você.",
        "step_5": "Publique o anúncio e comece a receber propostas!"
      },
      "final_message": "Junte-se a milhares de usuários que compram e vendem {title} todos os dias no Ambo Market."
    },
    "start_now": "Comece agora e encontre as melhores ofertas de {category} em {city}!"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h3 v-text="t('title', { title: props.productTitle })" />

    <p v-text="t('intro', { title: productTitle, city: city, category: category })" />

    <h3 v-text="t('listing_details')" />

    <ul>
      <li>
        <p v-text="t('details.category', { category: category })" />
      </li>

      <li>
        <p v-text="t('details.price', { price: price })" />
      </li>

      <li>
        <p v-text="t('details.location', { city: city })" />
      </li>

      <li>
        <p v-text="t('details.contact', { seller: seller })" />
      </li>
    </ul>

    <h3 v-text="t('why_buy.title', { category: category })" />

    <ol>
      <li>
        <p v-text="t('why_buy.point_1.title')" />

        <p v-text="t('why_buy.point_1.desc')" />

        <p
          v-if="productList?.length > 1"
          v-text="t('why_buy.point_1.can_find', { options: productList })"
        />
      </li>

      <li>
        <p v-text="t('why_buy.point_2.title')" />

        <p v-text="t('why_buy.point_2.desc')" />
      </li>

      <li>
        <p v-text="t('why_buy.point_3.title')" />

        <p v-text="t('why_buy.point_3.desc', { title: productTitle, city: city })" />
      </li>

      <li>
        <p v-text="t('why_buy.point_4.title')" />

        <p v-text="t('why_buy.point_4.desc')" />
      </li>
    </ol>

    <h3 v-text="t('contact_seller.title')" />

    <p v-text="t('contact_seller.desc', { title: productTitle })" />

    <h3 v-text="t('sell_your_items.title')" />

    <p v-text="t('sell_your_items.desc', { category: category })" />

    <ol>
      <li>
        <p v-text="t('sell_your_items.steps.step_1')" />
      </li>

      <li>
        <p v-text="t('sell_your_items.steps.step_2')" />
      </li>

      <li>
        <p v-text="t('sell_your_items.steps.step_3')" />
      </li>

      <li>
        <p v-text="t('sell_your_items.steps.step_4')" />
      </li>

      <li>
        <p v-text="t('sell_your_items.steps.step_5')" />
      </li>
    </ol>

    <p v-text="t('sell_your_items.final_message', { title: productTitle })" />

    <p v-text="t('start_now', { category: category, city: city })" />
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

  ul {
    padding-left: 16px;
  }
}
</style>
