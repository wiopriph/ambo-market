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
const location = computed(() => everywhere.value ? 'Angola' : cityName.value);

type CategoryContent = {
  intro: string;
  body: string;
  cta: string;
};

const categoryContent = computed((): CategoryContent => {
  const loc = location.value;

  const map: Record<string, CategoryContent> = {
    vehicles: {
      intro: `Compre ou venda carros, motos, caminhões e outros veículos em ${loc} no Ambo Market. Encontre carros usados e novos de particulares e concessionárias: Toyota Hilux, Land Cruiser, Corolla, Hyundai Tucson, Kia Sportage, Ford Ranger, Nissan Navara, Mitsubishi L200 e muitos outros modelos. Preços em kwanza (AOA) e anúncios com fotos reais.`,
      body: `Em ${loc}, o mercado de veículos usados é um dos mais activos da Ambo Market. Encontre pick-ups 4x4 para terrenos difíceis, berlinas para uso urbano em Luanda, ou motos para deslocamentos em Benguela e Huambo. Filtre por marca, ano, quilometragem, combustível e preço para encontrar a melhor oferta.`,
      cta: `Publique o seu anúncio de veículo gratuitamente em ${loc} e receba contactos directos de compradores interessados!`,
    },
    'real-estate': {
      intro: `Encontre imóveis à venda e para alugar em ${loc} no Ambo Market. Apartamentos T1, T2 e T3, moradias, terrenos, escritórios comerciais e armazéns — tudo num só lugar. Imóveis em Luanda (Talatona, Miramar, Kilamba, Viana), Benguela, Huambo, Soyo e outras províncias de Angola.`,
      body: 'O mercado imobiliário angolano está em crescimento. No Ambo Market encontrará condomínios fechados, vivendas independentes, apartamentos mobilados e não mobilados, terrenos urbanizados e espaços comerciais. Preços negociáveis em kwanza (AOA) ou USD. Anúncios de proprietários directos e imobiliárias verificadas.',
      cta: `Anuncie o seu imóvel gratuitamente em ${loc} e alcance milhares de potenciais compradores e inquilinos!`,
    },
    electronics: {
      intro: `Compre e venda electrónicos em ${loc} no Ambo Market. Smartphones novos e usados (iPhone, Samsung Galaxy, Xiaomi, Infinix, Tecno, Huawei), computadores portáteis, tablets, televisores, consolas de jogos PlayStation e Xbox, auscultadores, câmaras fotográficas e muito mais.`,
      body: `Em ${loc}, encontrará electrónicos de segunda mão em excelente estado a preços acessíveis. Compre um iPhone usado, um Samsung com garantia, um portátil recondicionado ou um televisor LED a um preço justo. Todos os anúncios com fotos reais e contacto directo com o vendedor.`,
      cta: `Anuncie o seu telemóvel, computador ou outro electrónico gratuitamente em ${loc} e venda rapidamente!`,
    },
    fashion: {
      intro: `Encontre roupas, calçado e acessórios em ${loc} no Ambo Market. Vestuário masculino e feminino, roupa infantil, capulanas, sapatilhas Nike, Adidas, Jordan, malas, bijutaria, óculos de sol e muito mais — de segunda mão ou novos, a preços imbatíveis.`,
      body: 'A moda em Angola combina tendências internacionais com o estilo africano único. No Ambo Market encontrará peças de marca, roupa em segunda mão em bom estado, sapatilhas importadas e acessórios de moda. Ideal para quem quer renovar o guarda-roupa sem gastar muito.',
      cta: `Venda as suas roupas e acessórios gratuitamente em ${loc} — publique um anúncio e encontre compradores rapidamente!`,
    },
    jobs: {
      intro: `Encontre emprego em ${loc} no Ambo Market. Vagas de trabalho em Luanda, Benguela, Huambo, Soyo, Malanje e outras cidades de Angola. Empregos em petróleo e gás, construção civil, tecnologia, saúde, educação, comércio e serviços. Candidatos e empresas, publiquem gratuitamente.`,
      body: 'O mercado de trabalho angolano oferece oportunidades em múltiplos sectores. Encontrará vagas para engenheiros, técnicos, motoristas, administrativos, vendedores, professores, médicos e profissionais de TI. Empresas angolanas e multinacionais publicam ofertas no Ambo Market diariamente.',
      cta: `Publique uma vaga ou o seu currículo gratuitamente em ${loc} e encontre o emprego ideal no Ambo Market!`,
    },
    services: {
      intro: `Encontre prestadores de serviços em ${loc} no Ambo Market. Electricistas, canalizadores, carpinteiros, pintores, mecânicos, técnicos de informática, criadores de sites, designers, fotógrafos, professores particulares e muito mais — todos disponíveis para contratar.`,
      body: `Em ${loc}, encontrará profissionais qualificados para qualquer necessidade: reparação de electrodomésticos, obras de construção civil, serviços de limpeza, transporte e mudanças, aulas particulares e serviços digitais. Compare preços e contrate directamente.`,
      cta: `Ofereça os seus serviços gratuitamente em ${loc} — publique no Ambo Market e expanda a sua clientela!`,
    },
    animals: {
      intro: `Compre, venda ou adopte animais em ${loc} no Ambo Market. Cães de raça (Pastor Alemão, Labrador, Rottweiler, Boerboel), gatos, aves, peixes ornamentais, animais de fazenda (gado, ovelhas, cabras, porcos, galinhas) e aves de capoeira. Animais saudáveis de criadores e particulares.`,
      body: `Em ${loc}, o Ambo Market é o sítio certo para quem quer adoptar um animal de estimação ou comprar animais de exploração agrícola. Encontrará cachorros vacinados com pedigree, gatos domésticos, pássaros exóticos e gado para a sua fazenda. Anúncios com fotos e preços negociáveis.`,
      cta: `Publique o seu anúncio de animal gratuitamente em ${loc} e encontre o comprador ou o lar certo!`,
    },
    hobby: {
      intro: `Encontre artigos de lazer e hobbies em ${loc} no Ambo Market. Instrumentos musicais (guitarras, teclados, bateria, djembe), equipamento desportivo, bicicletas, livros, jogos de tabuleiro, coleccionáveis, material de pesca e de campismo — novos e usados a preços acessíveis.`,
      body: `Em ${loc}, apaixonados por música, desporto, leitura e outras actividades encontram no Ambo Market tudo o que precisam. Compre uma guitarra usada, venda o seu equipamento de ginásio, troque livros ou encontre material de pesca de segunda mão. Grande variedade, preços competitivos.`,
      cta: `Venda ou compre artigos de lazer gratuitamente em ${loc} — publique o seu anúncio no Ambo Market!`,
    },
    kids: {
      intro: `Encontre artigos para bebés e crianças em ${loc} no Ambo Market. Brinquedos, roupa infantil, carrinhos de bebé, berços, cadeiras auto, material escolar, livros infantis e jogos educativos — novos e usados a preços acessíveis para poupadores.`,
      body: `Em ${loc}, pais e mães encontram no Ambo Market tudo o que os seus filhos precisam a preços muito abaixo do comércio. Roupa em segunda mão em bom estado, brinquedos quase novos, material de escola e equipamento de bebé — poupe kwanzas sem abdicar de qualidade.`,
      cta: `Venda artigos infantis que já não usa gratuitamente em ${loc} e ajude outras famílias a poupar no Ambo Market!`,
    },
    home: {
      intro: `Encontre móveis e artigos para a casa em ${loc} no Ambo Market. Sofás, camas, roupeiros, mesas de jantar, cozinhas equipadas, electrodomésticos (frigoríficos, máquinas de lavar, fogões, ar condicionado), iluminação e decoração — de segunda mão e novos, a preços imbatíveis.`,
      body: `Em ${loc}, o Ambo Market é o melhor lugar para mobilar a sua casa sem gastar muito. Encontre sofás em bom estado, electrodomésticos usados com garantia, mesas e cadeiras de qualidade, e artigos de decoração. Ideal para quem muda de casa ou quer renovar o espaço com um orçamento limitado.`,
      cta: `Venda os seus móveis e electrodomésticos gratuitamente em ${loc} — publique no Ambo Market e venda depressa!`,
    },
  };

  return map[props.categoryId] ?? {
    intro: `Encontre ${categoryName.value} em ${loc} no Ambo Market. Milhares de anúncios de particulares e empresas, com fotos reais e preços negociáveis em kwanza (AOA).`,
    body: `No Ambo Market encontrará a maior selecção de ${categoryName.value} em Angola. Compre, venda ou troque — sem comissões, sem intermediários, directamente entre comprador e vendedor.`,
    cta: `Publique o seu anúncio de ${categoryName.value} gratuitamente em ${loc} e comece a receber contactos hoje!`,
  };
});
</script>

<template>
  <div class="space-y-3 text-sm leading-6 text-muted">
    <h2 class="text-base font-semibold text-highlighted">
      {{ title }} – Anúncios Gratuitos no Ambo Market
    </h2>

    <p>
      {{ categoryContent.intro }}
    </p>

    <p>
      {{ categoryContent.body }}
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Por que escolher o Ambo Market?
    </h3>

    <ol class="list-decimal space-y-2 pl-5">
      <li>
        <p class="font-medium text-highlighted">
          Anúncios 100% Gratuitos
        </p>

        <p>
          Publique gratuitamente sem limites. Adicione fotos, defina o preço em kwanza (AOA) e comece a receber
          contactos directos de compradores interessados — sem comissões nem taxas ocultas.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Milhares de Ofertas em {{ location }}
        </p>

        <p>
          A maior plataforma de classificados de Angola reúne anúncios de particulares e empresas de Luanda, Benguela,
          Huambo, Soyo, Malanje e todas as províncias.<span
            v-if="productList?.length"
          > Encontre {{ productList.join(', ') }} e muito mais.</span>
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Pesquisa Rápida com Filtros Avançados
        </p>

        <p>
          Filtre por cidade, preço, estado (novo ou segunda mão) e outras características para encontrar exactamente o
          que procura em segundos.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Negociação Directa e Segura
        </p>

        <p>
          Contacte directamente os vendedores, negocie o preço e combine a entrega ou encontro. Prefira locais públicos
          e verifique sempre o produto antes de pagar.
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
        Registe-se ou entre na sua conta do Ambo Market.
      </li>

      <li>
        Clique em "Publicar Anúncio" e seleccione a categoria "{{ categoryName }}".
      </li>

      <li>
        Adicione uma descrição detalhada, fotos de qualidade e um preço justo em kwanza (AOA).
      </li>

      <li>
        Indique os seus dados de contacto para que os interessados possam falar consigo.
      </li>

      <li>
        Publique o anúncio gratuitamente e comece a receber propostas!
      </li>
    </ol>

    <h3
      class="text-base font-semibold text-highlighted"
      v-text="`Encontre as Melhores Ofertas de ${categoryName} em ${location}!`"
    />

    <p>
      {{ categoryContent.cta }}
    </p>

    <p>
      Navegue pelos anúncios, compare preços e fale directamente com os vendedores. O Ambo Market é o marketplace
      número 1 de classificados em Angola — simples, gratuito e para todos.
    </p>
  </div>
</template>
