<script setup lang="ts">
import { getCityById } from '~/constants/cities';
import { getCategoryName } from '~/constants/categories';


const props = defineProps<{
  title: string;
  cityId: string;
  categoryId: string;
  productList?: string[];
}>();

const cityName = computed(() => getCityById(props.cityId)?.name ?? '');
const categoryName = computed(() => getCategoryName(props.categoryId));
const everywhere = computed(() => props.cityId === 'all');
</script>

<template>
  <div class="space-y-3 text-sm leading-6 text-muted">
    <h3 class="text-base font-semibold text-highlighted">
      {{ title }} – Anúncios Gratuitos no Ambo Market
    </h3>

    <p v-if="everywhere">
      Se você está procurando {{ categoryName }} em Angola, chegou ao lugar certo! No Ambo Market, você pode comprar,
      vender ou trocar {{ categoryName }} sem custos adicionais. Publique anúncios gratuitos, encontre ótimas ofertas e
      economize tempo na busca pelos produtos ou serviços que você precisa.
    </p>

    <p v-else>
      Se você está procurando {{ categoryName }} em {{ cityName }}, chegou ao lugar certo! No Ambo Market, você pode
      comprar, vender ou trocar {{ categoryName }} sem custos adicionais. Publique anúncios gratuitos, encontre ótimas
      ofertas e economize tempo na busca pelos produtos ou serviços que você precisa.
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Por que Ambo Market?
    </h3>

    <ol class="list-decimal space-y-2 pl-5">
      <li>
        <p class="font-medium text-highlighted">
          Anúncios Gratuitos
        </p>

        <p>
          O Ambo Market é uma plataforma onde qualquer pessoa pode publicar um anúncio gratuitamente e encontrar
          compradores rapidamente. Basta criar um anúncio, adicionar fotos, definir o preço e aguardar os contatos!
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Grande Variedade de {{ categoryName }}
        </p>

        <p>
          Nosso site conta com milhares de anúncios de vendedores particulares e empresas.<span
            v-if="productList?.length"
          > Você pode encontrar {{ productList.join(', ') }} a preços acessíveis.</span>
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Pesquisa e Filtros Fáceis de Usar
        </p>

        <p>
          Sabemos como é importante encontrar o que você precisa rapidamente. Utilize nossos filtros para classificar
          por preço, estado, localização e outros critérios para encontrar a melhor opção.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Transações Seguras
        </p>

        <p>
          Comprar e vender por meio de anúncios classificados pode ser simples e seguro se você seguir algumas regras
          básicas: marque encontros em locais públicos, verifique o produto antes de pagar e mantenha uma comunicação
          clara com compradores ou vendedores.
        </p>
      </li>
    </ol>

    <h3 class="text-base font-semibold text-highlighted">
      <template v-if="everywhere">
        Como Publicar um Anúncio de {{ categoryName }}?
      </template>

      <template v-else>
        Como Publicar um Anúncio de {{ categoryName }} em {{ cityName }}?
      </template>
    </h3>

    <ol class="list-decimal space-y-1 pl-5">
      <li>
        Cadastre-se ou faça login na sua conta do Ambo Market.
      </li>

      <li>
        Clique em 'Publicar Anúncio' e escolha '{{ categoryName }}'.
      </li>

      <li>
        Adicione uma descrição detalhada, fotos de alta qualidade e um preço justo.
      </li>

      <li>
        Informe seus dados de contato para que os interessados possam falar com você.
      </li>

      <li>
        Publique seu anúncio e comece a receber propostas!
      </li>
    </ol>

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="`Encontre as Melhores Ofertas de ${categoryName} Hoje Mesmo!`"
    />

    <p v-if="everywhere">
      Não perca as melhores ofertas de {{ categoryName }} em Angola. Navegue pelos anúncios, compare preços e fale
      diretamente com os vendedores. Seja para comprar {{ categoryName }} novo ou usado, o Ambo Market é o melhor lugar
      para comprar e vender!
    </p>

    <p v-else>
      Não perca as melhores ofertas de {{ categoryName }} em {{ cityName }}. Navegue pelos anúncios, compare preços e
      fale diretamente com os vendedores. Seja para comprar {{ categoryName }} novo ou usado, o Ambo Market é o melhor
      lugar para comprar e vender!
    </p>

    <p v-if="everywhere">
      Comece sua busca agora e descubra ofertas incríveis de {{ categoryName }} em Angola!
    </p>

    <p v-else>
      Comece sua busca agora e descubra ofertas incríveis de {{ categoryName }} em {{ cityName }}!
    </p>
  </div>
</template>
