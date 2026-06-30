<script setup lang="ts">
import { getCityById } from '~/constants/cities';


const props = defineProps<{
  cityId: string;
}>();

const everywhere = computed(() => props.cityId === 'all');
const cityName = computed(() => getCityById(props.cityId)?.name ?? '');
const location = computed(() => everywhere.value ? 'Angola' : cityName.value);

type CityContent = {
  intro: string;
  body: string;
  categories: string;
};

const cityContent = computed(():    CityContent => {
  const map: Record<string, CityContent> = {
    luanda: {
      intro: 'Luanda é a maior cidade de Angola e o principal centro económico do país. No Ambo Market encontrará milhares de anúncios em Luanda: carros novos e usados, apartamentos para alugar e comprar em Talatona, Miramar, Kilamba, Viana, Cacuaco e Benfica, telemóveis, emprego e serviços.',
      body: 'Em Luanda, o mercado de classificados é muito activo. Compre um carro usado directamente de um particular, alugue um T2 ou T3 em Talatona sem pagar comissão a imobiliária, encontre emprego nas maiores empresas de petróleo, construção civil e tecnologia. Os melhores preços em kwanza (AOA) estão no Ambo Market.',
      categories: 'Categorias populares em Luanda: Carros e Motos, Imóveis, Telemóveis e Electrónicos, Emprego, Serviços, Roupas e Calçado, Móveis e Electrodomésticos.',
    },
    benguela: {
      intro: 'Benguela é a segunda maior cidade de Angola, localizada na costa atlântica. No Ambo Market encontrará anúncios em Benguela: carros usados, casas e apartamentos, telemóveis, emprego local e muito mais — tudo a preços acessíveis em kwanza (AOA).',
      body: 'A cidade de Benguela está em crescimento constante. No Ambo Market encontre anúncios de particulares e empresas locais: imóveis próximos da praia, veículos 4x4 e pick-ups, smartphones e electrónicos. Compre, venda e negocie directamente — sem intermediários.',
      categories: 'Categorias populares em Benguela: Veículos, Imóveis, Electrónicos, Emprego e Serviços.',
    },
    huambo: {
      intro: 'Huambo é a terceira maior cidade de Angola, no planalto central. No Ambo Market encontrará classificados em Huambo: carros usados, casas e terrenos, animais de criação, ferramentas agrícolas, emprego e serviços locais — com preços em kwanza (AOA).',
      body: 'Huambo tem um mercado local vibrante. No Ambo Market compre gado e animais de fazenda, venda imóveis no planalto central, encontre emprego ou publique a sua oferta de serviços. Anúncios gratuitos de particulares e empresas da região.',
      categories: 'Categorias populares em Huambo: Animais e Pecuária, Veículos, Imóveis, Emprego, Serviços Locais.',
    },
    lobito: {
      intro: 'Lobito é um importante porto industrial de Angola, próximo de Benguela. No Ambo Market encontrará anúncios em Lobito: imóveis, veículos, electrónicos, emprego na indústria portuária e serviços — a preços competitivos em kwanza (AOA).',
      body: 'Com o Porto do Lobito e o Corredor do Lobito em expansão, o mercado de trabalho e imóveis está em crescimento. Encontre oportunidades de emprego, compre ou alugue casa perto do porto, ou venda o seu carro rapidamente no Ambo Market.',
      categories: 'Populares em Lobito: Imóveis, Emprego, Veículos, Electrónicos.',
    },
    lubango: {
      intro: 'Lubango é a capital da Huíla e uma das cidades mais pitorescas de Angola, conhecida pela Serra da Leba. No Ambo Market encontrará classificados em Lubango: veículos, imóveis, animais, produtos agrícolas e emprego — com preços em kwanza (AOA).',
      body: 'Lubango tem uma economia diversificada com agricultura, comércio e serviços. No Ambo Market compre terras e terrenos agrícolas, venda o seu carro, encontre emprego ou publique a sua oferta de serviços para a comunidade da Huíla.',
      categories: 'Populares em Lubango: Animais, Imóveis, Veículos, Emprego.',
    },
    malanje: {
      intro: 'Malanje é uma cidade histórica no nordeste de Angola. No Ambo Market encontrará anúncios em Malanje: veículos usados, imóveis, animais de fazenda, produtos agrícolas e emprego regional — tudo a preços acessíveis em kwanza (AOA).',
      body: 'A região de Malanje tem grande actividade agrícola e pecuária. No Ambo Market compre e venda gado, produtos do campo, ferramentas e imóveis rurais. Anúncios gratuitos de particulares e empresas da província de Malanje.',
      categories: 'Populares em Malanje: Animais e Pecuária, Imóveis, Veículos, Emprego.',
    },
    cabinda: {
      intro: 'Cabinda é o enclave petrolífero de Angola e uma das províncias mais ricas do país. No Ambo Market encontrará classificados em Cabinda: imóveis, veículos, emprego no sector petrolífero e offshore, electrónicos e serviços — com preços em kwanza (AOA) e USD.',
      body: 'Cabinda tem um mercado muito activo graças à indústria do petróleo. Encontre emprego em empresas petrolíferas, alugue ou compre apartamentos, compre veículos 4x4 e equipamentos. Publique o seu anúncio gratuitamente no Ambo Market.',
      categories: 'Populares em Cabinda: Emprego (Petróleo/Offshore), Imóveis, Veículos 4x4, Electrónicos.',
    },
    soyo: {
      intro: 'Soyo é a principal cidade da província do Zaire e um centro chave da indústria petrolífera angolana. No Ambo Market encontrará anúncios em Soyo: emprego no sector energético, imóveis, veículos 4x4 e motos, electrónicos e serviços — preços em kwanza (AOA) e USD.',
      body: 'Com a presença de grandes empresas petrolíferas internacionais, Soyo tem grande procura por imóveis e emprego. No Ambo Market encontre trabalho em plataformas offshore, alugue apartamentos mobilados, compre um veículo pick-up ou venda os seus equipamentos.',
      categories: 'Populares em Soyo: Emprego (Petróleo), Imóveis, Veículos 4x4, Electrónicos.',
    },
    namibe: {
      intro: 'Namibe é uma cidade costeira no sul de Angola, conhecida pelas suas paisagens desérticas únicas. No Ambo Market encontrará classificados em Namibe: imóveis, veículos, pesca e actividades marítimas, emprego e serviços locais — em kwanza (AOA).',
      body: 'A cidade de Namibe tem um mercado local activo, especialmente na pesca e comércio. Compre ou alugue casa, venda o seu carro, encontre emprego ou publique a sua oferta de serviços para a comunidade do Namibe no Ambo Market.',
      categories: 'Populares em Namibe: Imóveis, Veículos, Emprego, Serviços.',
    },
    kuito: {
      intro: 'Kuito é a capital da Bié, no planalto central de Angola. No Ambo Market encontrará classificados em Kuito: veículos usados, imóveis, animais de criação, produtos agrícolas, emprego e serviços — com preços acessíveis em kwanza (AOA).',
      body: 'A região da Bié tem forte actividade agrícola e pecuária. No Ambo Market compre gado e animais, imóveis rurais e urbanos, ferramentas agrícolas e muito mais. Publique o seu anúncio gratuitamente e alcance compradores em toda Angola.',
      categories: 'Populares em Kuito: Animais, Imóveis, Veículos, Emprego.',
    },
  };

  if (!everywhere.value && map[props.cityId]) {
    return map[props.cityId];
  }

  return {
    intro: 'O Ambo Market é o maior marketplace de classificados grátis em Angola. Compre e venda carros, motos, imóveis, telemóveis, electrónicos, roupas, emprego, serviços e muito mais — directamente entre particulares e empresas, sem comissões e sem intermediários.',
    body: 'Encontrará anúncios de todas as províncias de Angola: Luanda, Benguela, Huambo, Soyo, Malanje, Cabinda, Lobito, Lubango, Namibe e Kuito. Compre novo ou em segunda mão, com preços negociáveis em kwanza (AOA). A maior selecção de produtos e serviços num só lugar.',
    categories: 'Categorias disponíveis: Veículos (carros, motos, caminhões), Imóveis (venda e arrendamento), Electrónicos (telemóveis, computadores, TV), Moda e Vestuário, Emprego, Serviços, Animais, Hobbies, Artigos para Crianças e Casa e Jardim.',
  };
});
</script>

<template>
  <div class="space-y-3 text-sm leading-6 text-muted">
    <h3 class="text-base font-semibold text-highlighted">
      Classificados Grátis em {{ location }} – Compre e Venda no Ambo Market
    </h3>

    <p>
      {{ cityContent.intro }}
    </p>

    <p>
      {{ cityContent.body }}
    </p>

    <p>
      {{ cityContent.categories }}
    </p>

    <h3 class="text-base font-semibold text-highlighted">
      Por que usar o Ambo Market em {{ location }}?
    </h3>

    <ol class="list-decimal space-y-2 pl-5">
      <li>
        <p class="font-medium text-highlighted">
          100% Gratuito – Sem Taxas, Sem Comissões
        </p>

        <p>
          Publique quantos anúncios quiser sem pagar nada. Adicione fotos, defina o preço em kwanza (AOA) e comece a
          receber contactos directos de compradores reais.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Maior Selecção de Anúncios em {{ location }}
        </p>

        <p>
          Milhares de anúncios actualizados diariamente: carros usados, imóveis, smartphones novos e de segunda mão,
          vagas de emprego, serviços e muito mais — tudo concentrado numa só plataforma.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Negociação Directa entre Comprador e Vendedor
        </p>

        <p>
          Sem intermediários. Contacte directamente o vendedor, negocie o preço e feche o negócio. Simples, rápido e
          seguro.
        </p>
      </li>

      <li>
        <p class="font-medium text-highlighted">
          Para Particulares e Empresas
        </p>

        <p>
          Qualquer pessoa pode publicar um anúncio: particular, pequeno negócio, concessionária de carros, imobiliária,
          loja de electrónicos ou empresa de serviços. Todos bem-vindos no Ambo Market.
        </p>
      </li>
    </ol>

    <h3 class="text-base font-semibold text-highlighted">
      Como Publicar um Anúncio Grátis em {{ location }}?
    </h3>

    <ol class="list-decimal space-y-1 pl-5">
      <li>
        Registe-se gratuitamente ou entre na sua conta do Ambo Market.
      </li>

      <li>
        Clique em "Publicar Anúncio" e escolha a categoria do seu produto ou serviço.
      </li>

      <li>
        Adicione fotos de qualidade, uma descrição clara e o preço em kwanza (AOA).
      </li>

      <li>
        Indique a sua cidade e os dados de contacto para receber propostas.
      </li>

      <li>
        Publique e comece a receber contactos de compradores interessados hoje mesmo!
      </li>
    </ol>

    <p>
      O Ambo Market é o marketplace número 1 de classificados em Angola — rápido, gratuito e pensado para a realidade
      angolana. Junte-se a milhares de angolanos que já compram e vendem online com segurança e confiança.
    </p>
  </div>
</template>
