<script setup lang="ts">
const props = defineProps<{
  productTitle: string;
  category: string;
  price: string | number;
  city: string;
  seller: string;
  productList?: string[];
}>();
</script>

<template>
  <div class="space-y-3 text-sm leading-6 text-muted">
    <h3 class="text-base font-semibold text-highlighted">
      {{ productTitle }} – Compre &amp; Venda no Ambo Market
    </h3>

    <p>
      Procurando {{ productTitle }} em {{ city }}? No Ambo Market, você pode encontrar e comprar {{ productTitle }} de
      vendedores confiáveis.
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Detalhes do Anúncio
    </h3>

    <ul class="list-disc space-y-1 pl-5">
      <li>
        Categoria: {{ category }}
      </li>

      <li>
        Preço: {{ price }}
      </li>

      <li>
        Localização: {{ city }}
      </li>

      <li>
        Contato: {{ seller }}
      </li>
    </ul>

    <h3 class="text-base font-semibold text-highlighted">
      Por que Comprar {{ category }} no Ambo Market?
    </h3>

    <ol class="list-decimal space-y-3 pl-5">
      <li>
        <p class="font-medium text-highlighted">
          Plataforma Gratuita e Conveniente
        </p>

        <p>
          O Ambo Market permite que você navegue por milhares de anúncios sem nenhum custo.
        </p>

        <p v-if="productList?.length > 1">
          Se você está procurando {{ productList.join(', ') }}, encontrará diversas alternativas em um só lugar.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Vendedores Reais e Confiáveis
        </p>

        <p>
          Todos os anúncios são publicados por usuários reais. Você pode entrar em contato diretamente com o vendedor
          antes de decidir.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Negociação Fácil e Compras Locais
        </p>

        <p>
          Encontre {{ productTitle }} em {{ city }} perto de você! Fale com o vendedor, negocie o preço e combine um
          ponto de encontro.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Transações Seguras
        </p>

        <p>
          Prefira se encontrar em locais públicos, verifique o item antes de pagar e confirme todos os detalhes.
        </p>
      </li>
    </ol>

    <h3 class="text-base font-semibold text-highlighted">
      Como Entrar em Contato com o Vendedor?
    </h3>

    <p>
      Interessado em {{ productTitle }}? Entre em contato pelos detalhes do anúncio ou envie uma mensagem pelo Ambo
      Market.
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Quer Vender Seus Próprios Itens? Publique um Anúncio Grátis!
    </h3>

    <p>
      Se você tem um item da categoria {{ category }} para vender, publique gratuitamente em minutos.
    </p>

    <ol class="list-decimal space-y-1 pl-5">
      <li>
        Cadastre-se ou faça login na sua conta do Ambo Market.
      </li>

      <li>
        Clique em 'Publicar Anúncio' e escolha a categoria correta.
      </li>

      <li>
        Envie fotos de alta qualidade, escreva uma descrição e defina um preço justo.
      </li>

      <li>
        Informe seus dados de contato para que os interessados possam falar com você.
      </li>

      <li>
        Publique o anúncio e comece a receber propostas!
      </li>
    </ol>

    <p>
      Junte-se a milhares de usuários que compram e vendem {{ productTitle }} todos os dias no Ambo Market.
    </p>

    <p>
      Comece agora e encontre as melhores ofertas de {{ category }} em {{ city }}!
    </p>
  </div>
</template>
