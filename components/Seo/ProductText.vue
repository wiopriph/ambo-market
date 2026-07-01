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
    <h2 class="text-base font-semibold text-highlighted">
      {{ productTitle }} – à venda em {{ city }} | Ambo Market
    </h2>

    <p>
      Encontrou um óptimo anúncio: <strong class="text-highlighted">{{ productTitle }}</strong> em {{ city }}, por
      {{ price }}, publicado por {{ seller }} na categoria {{ category }}. No Ambo Market, todos os anúncios são
      gratuitos e publicados por vendedores reais — sem intermediários, sem comissões.
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Por que comprar {{ category }} no Ambo Market?
    </h3>

    <ol class="list-decimal space-y-2 pl-5">
      <li>
        <p class="font-medium text-highlighted">
          Preços Directos de Particulares e Empresas
        </p>

        <p>
          Negocie directamente com o vendedor e obtenha o melhor preço. Sem lojas intermediárias, sem margens
          inflacionadas — o preço que vê é o preço negociado entre comprador e vendedor.
          <span v-if="productList?.length > 1"> Veja também: {{ productList.join(', ') }}.</span>
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Vendedores Verificados em {{ city }}
        </p>

        <p>
          Os anúncios no Ambo Market são publicados por utilizadores reais de Angola: particulares e empresas
          estabelecidas em Luanda, Benguela, Huambo, Soyo e outras cidades. Veja o perfil do vendedor, o histórico de
          anúncios e entre em contacto com confiança.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Compra Local em {{ city }}
        </p>

        <p>
          Encontre {{ productTitle }} perto de si em {{ city }}. Combine um ponto de encontro, veja o produto
          pessoalmente antes de pagar e feche o negócio com segurança.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Maior Selecção de {{ category }} em Angola
        </p>

        <p>
          O Ambo Market reúne milhares de anúncios de {{ category }} em todo o país. Se este anúncio não for o ideal,
          navegue pelas outras ofertas disponíveis e encontre a opção perfeita.
        </p>
      </li>
    </ol>

    <h3 class="text-base font-semibold text-highlighted">
      Como Entrar em Contacto com o Vendedor?
    </h3>

    <p>
      Interessado em <strong class="text-highlighted">{{ productTitle }}</strong>? Clique no botão de contacto acima
      para enviar uma mensagem ou ligar directamente ao vendedor {{ seller }}. Responda rapidamente — os melhores
      anúncios são vendidos depressa!
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Tem {{ category }} para Vender? Publique Grátis!
    </h3>

    <p>
      Junte-se a milhares de angolanos que vendem {{ category }} no Ambo Market todos os dias. Publicar um anúncio é
      rápido, gratuito e sem comissões.
    </p>

    <ol class="list-decimal space-y-1 pl-5">
      <li>
        Registe-se ou entre na sua conta do Ambo Market.
      </li>

      <li>
        Clique em "Publicar Anúncio" e seleccione a categoria "{{ category }}".
      </li>

      <li>
        Adicione fotos de qualidade, uma descrição clara e o preço em kwanza (AOA).
      </li>

      <li>
        Indique os seus dados de contacto para receber propostas directamente.
      </li>

      <li>
        Publique gratuitamente e comece a vender hoje mesmo!
      </li>
    </ol>

    <p>
      O Ambo Market é o marketplace número 1 de classificados em Angola — compre e venda {{ category }} em {{ city }}
      de forma simples, segura e completamente gratuita.
    </p>
  </div>
</template>
