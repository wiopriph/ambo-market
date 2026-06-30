<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { getCityById } from '~/constants/cities';
import { CATEGORIES, getCategoryName, getSubcategoryName } from '~/constants/categories';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-subcategory',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});

type SeoEntry = { h1: string; title: string; description: string };

const SEARCH_SEO = {
  city: {
    h1: 'Anúncios para «{q}» em {city}',
    title: '{q} em {city} – Anúncios de Particulares e Empresas | Ambo Market',
    description: 'Veja anúncios de {q} em {city}: novos e segunda mão, com fotos, preços e avaliações. Compre ou venda com segurança. Publique grátis no Ambo Market.',
  },
  everywhere: {
    h1: 'Anúncios para «{q}»',
    title: '{q} à Venda em Angola – Classificados Grátis | Ambo Market',
    description: 'Encontre {q} em toda Angola – Luanda, Benguela, Huambo e mais. Produtos novos e usados de particulares e empresas. Anuncie gratuitamente no Ambo Market.',
  },
};

const SUBCATEGORY_SEO: Record<string, Record<string, { city: SeoEntry; everywhere: SeoEntry }>> = {
  vehicles: {
    cars: {
      city: {
        h1: 'Carros à Venda em {city}',
        title: 'Carros Novos e Usados em {city} – Toyota, Honda, Hyundai | Ambo Market',
        description: 'Compre ou venda carros em {city}: sedans, SUVs, pickups e mais. Toyota, Honda, Hyundai, Mitsubishi e outras marcas. Compare preços e contacte vendedores verificados.',
      },
      everywhere: {
        h1: 'Carros à Venda',
        title: 'Carros Novos e Usados em Angola – Melhores Preços | Ambo Market',
        description: 'Carros à venda em Angola: novos e segunda mão de particulares e concessionárias. Toyota Hilux, Corolla, Land Cruiser, Honda, Hyundai e mais. Anuncie grátis no Ambo Market.',
      },
    },
    motorcycles: {
      city: {
        h1: 'Motas à Venda em {city}',
        title: 'Motas e Scooters Novos e Usados em {city} | Ambo Market',
        description: 'Compre ou venda motas em {city}: Honda, Yamaha, Suzuki, Kawasaki e scooters. Novos e segunda mão a preços competitivos. Anuncie a sua moto grátis no Ambo Market.',
      },
      everywhere: {
        h1: 'Motas à Venda',
        title: 'Motas e Scooters em Angola – Honda, Yamaha, Suzuki | Ambo Market',
        description: 'Motas à venda em Angola: Honda CG, Yamaha YBR, Suzuki GSX, Kawasaki Ninja e scooters. Novos e usados de particulares. Publique o seu anúncio grátis.',
      },
    },
    commercial: {
      city: {
        h1: 'Veículos Comerciais em {city}',
        title: 'Caminhões, Carrinhas e Furgões Comerciais em {city} | Ambo Market',
        description: 'Veículos comerciais em {city}: caminhões, carrinhas, furgões, pick-ups e autocarros. Para empresas e transportes. Anuncie grátis ou encontre o veículo ideal.',
      },
      everywhere: {
        h1: 'Veículos Comerciais',
        title: 'Caminhões, Carrinhas e Veículos Comerciais em Angola | Ambo Market',
        description: 'Veículos comerciais em Angola: caminhões pesados e médios, carrinhas, furgões e pick-ups para frotas empresariais. Anúncios de toda Angola. Publique grátis.',
      },
    },
    boats: {
      city: {
        h1: 'Barcos e Embarcações em {city}',
        title: 'Barcos, Lanchas e Embarcações de Pesca em {city} | Ambo Market',
        description: 'Compre ou venda barcos em {city}: lanchas, barcos de pesca, canoas e embarcações de lazer. Motores fora de borda e acessórios náuticos. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Barcos e Embarcações',
        title: 'Barcos e Embarcações à Venda em Angola – Pesca e Lazer | Ambo Market',
        description: 'Barcos em Angola: lanchas de pesca, canoas, barcos de lazer e motores náuticos. Ideal para rios, lagos e costa atlântica. Particulares e empresas. Anuncie grátis.',
      },
    },
    parts: {
      city: {
        h1: 'Peças e Acessórios Automóvel em {city}',
        title: 'Peças para Carros e Motas em {city} – Pneus, Baterias e Mais | Ambo Market',
        description: 'Peças auto em {city}: pneus, baterias, faróis, jantes, espelhos, suspensão e óleo motor. Novos e recondicionados. Vendedores verificados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Peças e Acessórios',
        title: 'Peças para Carros em Angola – Pneus, Baterias, Faróis | Ambo Market',
        description: 'Peças e acessórios auto em Angola: pneus, baterias, filtros, escapes, jantes e peças de motor. Para carros Toyota, Honda, Hyundai e mais. Anuncie grátis no Ambo Market.',
      },
    },
  },
  'real-estate': {
    rent: {
      city: {
        h1: 'Imóveis para Aluguel em {city}',
        title: 'Casas e Apartamentos para Alugar em {city} – Quartos e T1 a T4 | Ambo Market',
        description: 'Encontre imóveis para alugar em {city}: quartos, T1, T2, T3 e T4, vivendas e moradias. Bairros populares e preços acessíveis. Anuncie o seu imóvel grátis.',
      },
      everywhere: {
        h1: 'Imóveis para Aluguel',
        title: 'Casas e Apartamentos para Alugar em Angola – Luanda e Mais | Ambo Market',
        description: 'Aluguel de imóveis em Angola: apartamentos T1 a T4, quartos, moradias e viveiros em Luanda, Benguela, Huambo e todo o país. Proprietários e agências. Anuncie grátis.',
      },
    },
    sale: {
      city: {
        h1: 'Imóveis à Venda em {city}',
        title: 'Casas, Apartamentos e Terrenos à Venda em {city} | Ambo Market',
        description: 'Imóveis à venda em {city}: casas, apartamentos, viveiros e terrenos residenciais. Bons preços, vendedores verificados e fotos reais. Anuncie o seu imóvel grátis.',
      },
      everywhere: {
        h1: 'Imóveis à Venda',
        title: 'Casas, Apartamentos e Terrenos à Venda em Angola | Ambo Market',
        description: 'Compre imóveis em Angola: casas, apartamentos, viveiros e terrenos em Luanda, Benguela, Huambo, Soyo e todo o país. Investimento seguro. Anuncie ou pesquise grátis.',
      },
    },
    'commercial-property': {
      city: {
        h1: 'Imóveis Comerciais em {city}',
        title: 'Lojas, Escritórios, Armazéns e Espaços Comerciais em {city} | Ambo Market',
        description: 'Espaços comerciais em {city}: lojas para venda ou aluguel, escritórios, armazéns, galpões e restaurantes. Para empresas e investidores. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Imóveis Comerciais',
        title: 'Lojas, Escritórios e Armazéns Comerciais em Angola | Ambo Market',
        description: 'Imóveis comerciais em Angola: lojas, escritórios, armazéns e galpões para venda ou aluguel. Luanda, Benguela e outras províncias. Proprietários e agências. Grátis.',
      },
    },
    land: {
      city: {
        h1: 'Terrenos à Venda em {city}',
        title: 'Terrenos e Lotes Residenciais e Comerciais em {city} | Ambo Market',
        description: 'Terrenos à venda em {city}: lotes residenciais, comerciais e agrícolas. Documentação regularizada. Bons preços. Anuncie o seu terreno gratuitamente.',
      },
      everywhere: {
        h1: 'Terrenos à Venda',
        title: 'Terrenos e Lotes à Venda em Angola – Residenciais e Agrícolas | Ambo Market',
        description: 'Terrenos à venda em Angola: lotes residenciais, fazendas agrícolas e parcelas comerciais. Em Luanda, Benguela, Malanje, Huíla e todo o país. Anuncie grátis.',
      },
    },
  },
  electronics: {
    phones: {
      city: {
        h1: 'Telemóveis à Venda em {city}',
        title: 'Smartphones iPhone, Samsung, Xiaomi em {city} – Novos e Usados | Ambo Market',
        description: 'Telemóveis em {city}: iPhone 14, 15, Samsung Galaxy, Xiaomi, Infinix, Tecno e mais. Novos e segunda mão com garantia. Anuncie o seu smartphone grátis.',
      },
      everywhere: {
        h1: 'Telemóveis à Venda',
        title: 'Smartphones em Angola – iPhone, Samsung, Xiaomi, Infinix | Ambo Market',
        description: 'Compre ou venda smartphones em Angola: iPhone, Samsung Galaxy, Xiaomi, Infinix, Tecno e mais. Novos e usados com boas condições. Anuncie grátis no Ambo Market.',
      },
    },
    computers: {
      city: {
        h1: 'Computadores e Portáteis em {city}',
        title: 'Laptops HP, Dell, Lenovo e PCs em {city} – Novos e Usados | Ambo Market',
        description: 'Portáteis e computadores em {city}: HP, Dell, Lenovo, Apple MacBook e desktops. Novos e usados. Monitores, impressoras e acessórios. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Computadores e Portáteis',
        title: 'Laptops HP, Dell, Lenovo e PCs em Angola | Ambo Market',
        description: 'Computadores em Angola: portáteis HP, Dell, Lenovo, Asus, Apple MacBook e desktops. Novos e segunda mão. Monitores, teclados, impressoras. Anuncie grátis.',
      },
    },
    gaming: {
      city: {
        h1: 'Equipamentos de Jogos em {city}',
        title: 'PS5, Xbox, Nintendo Switch e Jogos em {city} | Ambo Market',
        description: 'Videojogos e consolas em {city}: PlayStation 5, Xbox Series X, Nintendo Switch e jogos. Novos e usados. Controles, headsets e acessórios. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Equipamentos de Jogos',
        title: 'PS5, Xbox, Nintendo Switch e Jogos em Angola | Ambo Market',
        description: 'Consolas e videojogos em Angola: PS5, PS4, Xbox Series, Nintendo Switch e jogos populares. Novos e usados. Anuncie ou compre com segurança no Ambo Market.',
      },
    },
    'tv-audio-photo': {
      city: {
        h1: 'TV, Áudio e Fotografia em {city}',
        title: 'TVs Samsung, LG, Colunas e Câmaras em {city} | Ambo Market',
        description: 'Equipamentos de som e imagem em {city}: TVs 4K Samsung, LG, Sony, colunas Bluetooth, câmaras fotográficas e projectores. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'TV, Áudio e Fotografia',
        title: 'TVs, Colunas e Câmaras em Angola – Samsung, LG, Sony | Ambo Market',
        description: 'TVs e áudio em Angola: televisores 4K, Smart TVs, colunas Bluetooth, soundbars, câmaras Canon, Nikon e drones. Novos e segunda mão. Anuncie grátis.',
      },
    },
    appliances: {
      city: {
        h1: 'Eletrodomésticos em {city}',
        title: 'Frigoríficos, Máquinas de Lavar, Ar Condicionado em {city} | Ambo Market',
        description: 'Eletrodomésticos em {city}: frigoríficos, máquinas de lavar, fogões, micro-ondas, ar condicionado e mais. Novos e usados. Compre barato ou anuncie grátis.',
      },
      everywhere: {
        h1: 'Eletrodomésticos',
        title: 'Frigoríficos, Ar Condicionado e Eletrodomésticos em Angola | Ambo Market',
        description: 'Eletrodomésticos em Angola: frigoríficos, máquinas de lavar, fogões a gás, ar condicionado, micro-ondas e geradores. Novos e usados. Anuncie grátis.',
      },
    },
    'accessories-electronics': {
      city: {
        h1: 'Acessórios Electrónicos em {city}',
        title: 'Carregadores, Capas, Auriculares e Gadgets em {city} | Ambo Market',
        description: 'Acessórios electrónicos em {city}: carregadores, capas, auriculares, cabos HDMI, power banks, smartwatches e gadgets. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Acessórios Electrónicos',
        title: 'Carregadores, Auriculares e Gadgets em Angola | Ambo Market',
        description: 'Acessórios electrónicos em Angola: carregadores originais e compatíveis, auriculares, smartwatches, power banks e cabos. Para telemóveis e PCs. Anuncie grátis.',
      },
    },
  },
  fashion: {
    men: {
      city: {
        h1: 'Moda Masculina em {city}',
        title: 'Roupas e Acessórios para Homem em {city} – Camisas, Calças, Sapatos | Ambo Market',
        description: 'Moda masculina em {city}: camisas, calças, casacos, fatos, sapatos, cintos e relógios. Marcas originais e preços acessíveis. Novos e segunda mão. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Moda Masculina',
        title: 'Roupas Masculinas em Angola – Camisas, Fatos, Sapatos | Ambo Market',
        description: 'Roupa para homem em Angola: camisas, calças jeans, fatos, casacos, ténis, sapatos sociais e acessórios. Marcas originais e imitações. Anuncie ou compre grátis.',
      },
    },
    women: {
      city: {
        h1: 'Moda Feminina em {city}',
        title: 'Roupas, Vestidos e Acessórios Femininos em {city} | Ambo Market',
        description: 'Moda feminina em {city}: vestidos, blusas, calças, saias, bolsas, perfumes e bijuteria. Tendências actuais a preços acessíveis. Novos e segunda mão. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Moda Feminina',
        title: 'Roupas e Acessórios Femininos em Angola – Vestidos, Bolsas | Ambo Market',
        description: 'Moda feminina em Angola: vestidos capulana, blusas, calças, bolsas de marca, sandálias e bijuteria. Tendências actuais para todos os orçamentos. Anuncie grátis.',
      },
    },
    shoes: {
      city: {
        h1: 'Sapatos à Venda em {city}',
        title: 'Sapatos, Ténis e Sandálias em {city} – Homem e Mulher | Ambo Market',
        description: 'Calçado em {city}: sapatos sociais, ténis Nike, Adidas, botas, sandálias e chinelos. Para homem, mulher e criança. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Sapatos à Venda',
        title: 'Sapatos, Ténis e Sandálias em Angola – Nike, Adidas e Mais | Ambo Market',
        description: 'Calçado em Angola: ténis Nike, Adidas, Puma, sapatos sociais, botas e sandálias. Para todas as idades e ocasiões. Novos e segunda mão. Anuncie grátis.',
      },
    },
    bags: {
      city: {
        h1: 'Mochilas e Malas em {city}',
        title: 'Malas de Mão, Mochilas e de Viagem em {city} | Ambo Market',
        description: 'Veja malas femininas, mochilas escolares e malas de viagem em {city}. Compre ou publique anúncios de forma fácil e grátis.',
      },
      everywhere: {
        h1: 'Mochilas e Malas',
        title: 'Malas de Mão, Mochilas e de Viagem em Angola | Ambo Market',
        description: 'Descubra malas para uso diário, trabalho ou viagem em Angola. Publique ou veja ofertas com um clique.',
      },
    },
    'accessories-fashion': {
      city: {
        h1: 'Acessórios de Moda em {city}',
        title: 'Relógios, Óculos e Bijuterias em {city} | Ambo Market',
        description: 'Complete o seu visual com acessórios de moda em {city}. Chapéus, cintos, colares, óculos e mais. Compre ou anuncie grátis.',
      },
      everywhere: {
        h1: 'Acessórios de Moda',
        title: 'Relógios, Bijuterias e Óculos em Angola | Ambo Market',
        description: 'Acessórios para complementar qualquer look. Compre ou venda relógios, colares, pulseiras e muito mais em Angola.',
      },
    },
    'beauty-products': {
      city: {
        h1: 'Produtos de Beleza em {city}',
        title: 'Perfumes, Maquilhagem e Cosméticos em {city} | Ambo Market',
        description: 'Veja produtos de beleza em {city}. Perfumes, cremes, maquilhagem, itens para cabelo e muito mais. Anuncie ou compre facilmente.',
      },
      everywhere: {
        h1: 'Produtos de Beleza',
        title: 'Cosméticos, Perfumes e Cuidados Pessoais em Angola | Ambo Market',
        description: 'Compre e venda produtos de beleza em Angola. Maquilhagem, cuidados com a pele e perfumes. Tudo num só lugar.',
      },
    },
  },
  jobs: {
    vacancies: {
      city: {
        h1: 'Ofertas de Emprego em {city}',
        title: 'Candidate-se a Vagas de Emprego em {city} | Ambo Market',
        description: 'Veja vagas de trabalho publicadas por empresas em {city}. Trabalhos a tempo inteiro, parcial, freelance ou remoto. Candidate-se ou publique uma vaga gratuitamente.',
      },
      everywhere: {
        h1: 'Ofertas de Emprego',
        title: 'Candidate-se a Vagas de Emprego em Angola | Ambo Market',
        description: 'Explore anúncios de emprego em toda Angola. Encontre novas oportunidades ou publique uma vaga de graça.',
      },
    },
    resumes: {
      city: {
        h1: 'Candidatos à Procura de Emprego em {city}',
        title: 'Veja Currículos em {city} | Ambo Market',
        description: 'Encontre profissionais à procura de trabalho em {city}. Filtre por setor, experiência ou habilidades. Contrate localmente ou remotamente.',
      },
      everywhere: {
        h1: 'Candidatos à Procura de Emprego',
        title: 'Veja Currículos em Angola | Ambo Market',
        description: 'Empregadores – descubram candidatos qualificados em Angola. Veja currículos ou publique as suas vagas hoje mesmo.',
      },
    },
  },
  services: {
    construction: {
      city: {
        h1: 'Serviços de Construção em {city}',
        title: 'Contrate Pedreiros, Pintores e Técnicos em {city} | Ambo Market',
        description: 'Encontre profissionais para construção, reformas, pintura, canalização e mais em {city}. Publique ou responda a anúncios gratuitamente.',
      },
      everywhere: {
        h1: 'Serviços de Construção',
        title: 'Contrate Pedreiros, Pintores e Técnicos em Angola | Ambo Market',
        description: 'Conecte-se com profissionais de construção em toda Angola. Publique ou explore anúncios para obras, reparações e serviços técnicos.',
      },
    },
    'it-dev': {
      city: {
        h1: 'Serviços de TI e Desenvolvimento em {city}',
        title: 'Contrate Programadores, Designers e Técnicos em {city} | Ambo Market',
        description: 'Anúncios de desenvolvimento web, criação de apps, suporte técnico e design em {city}. Publique ou contrate profissionais de TI.',
      },
      everywhere: {
        h1: 'Serviços de TI e Desenvolvimento',
        title: 'Contrate Programadores, Designers e Técnicos em Angola | Ambo Market',
        description: 'Descubra especialistas em tecnologia em toda Angola. Criação de sites, aplicações, suporte e mais.',
      },
    },
    education: {
      city: {
        h1: 'Educação e Aulas Particulares em {city}',
        title: 'Encontre Professores, Cursos e Aulas de Idiomas em {city} | Ambo Market',
        description: 'Veja ofertas de explicações, cursos online, preparação para exames e mais em {city}. Anuncie ou contrate serviços educacionais.',
      },
      everywhere: {
        h1: 'Educação e Aulas Particulares',
        title: 'Encontre Professores, Cursos e Aulas em Angola | Ambo Market',
        description: 'Ofereça ou contrate serviços de educação em toda Angola. Aulas presenciais ou online disponíveis.',
      },
    },
    beauty: {
      city: {
        h1: 'Serviços de Beleza e Bem-Estar em {city}',
        title: 'Salões, Massagens e Estética em {city} | Ambo Market',
        description: 'Marque corte de cabelo, manicure, massagens e tratamentos em {city}. Anuncie ou encontre serviços de beleza facilmente.',
      },
      everywhere: {
        h1: 'Serviços de Beleza e Bem-Estar',
        title: 'Salões, Massagens e Estética em Angola | Ambo Market',
        description: 'Veja anúncios de beleza e bem-estar – cabeleireiros, spas, estética e mais. Ofereça ou contrate serviços em Angola.',
      },
    },
    'other-services': {
      city: {
        h1: 'Outros Serviços em {city}',
        title: 'Contrate ou Ofereça Serviços em {city} | Ambo Market',
        description: 'Planeamento de eventos, entregas, logística e muito mais. Anuncie ou procure serviços variados em {city}.',
      },
      everywhere: {
        h1: 'Outros Serviços',
        title: 'Contrate ou Ofereça Serviços em Angola | Ambo Market',
        description: 'Descubra serviços locais e remotos em Angola. Desde recados a consultorias – publique ou encontre o que precisa.',
      },
    },
  },
  animals: {
    pets: {
      city: {
        h1: 'Animais de Estimação à Venda em {city}',
        title: 'Compre ou Adote Cães, Gatos e Mais em {city} | Ambo Market',
        description: 'Encontre cachorros, gatos e outros animais de estimação em {city}. Anuncie ou explore ofertas de adoção e venda de criadores ou particulares.',
      },
      everywhere: {
        h1: 'Animais de Estimação à Venda',
        title: 'Compre ou Adote Cães, Gatos e Mais em Angola | Ambo Market',
        description: 'Descubra animais para venda ou adoção em toda Angola. Cães, gatos, coelhos e mais – veja anúncios ou publique o seu.',
      },
    },
    'other-animals': {
      city: {
        h1: 'Gado e Animais Exóticos em {city}',
        title: 'Compre ou Venda Aves, Peixes e Gado em {city} | Ambo Market',
        description: 'Veja ofertas de galinhas, cabras, papagaios, peixes e mais em {city}. Anuncie ou encontre animais variados com facilidade.',
      },
      everywhere: {
        h1: 'Gado e Animais Exóticos',
        title: 'Compre ou Venda Aves, Peixes e Gado em Angola | Ambo Market',
        description: 'De aves a peixes ornamentais – encontre todo tipo de animal em Angola. Anuncie ou compre com confiança.',
      },
    },
    supplies: {
      city: {
        h1: 'Produtos para Animais em {city}',
        title: 'Compre Rações, Gaiolas e Acessórios em {city} | Ambo Market',
        description: 'Ofertas de ração, utensílios de higiene, aquários, trelas e mais em {city}. Publique ou explore anúncios de produtos para animais.',
      },
      everywhere: {
        h1: 'Produtos para Animais',
        title: 'Compre Rações, Gaiolas e Acessórios em Angola | Ambo Market',
        description: 'Encontre produtos para animais em toda Angola. Alimentos, acessórios e equipamentos – tudo num só lugar.',
      },
    },
  },
  hobby: {
    sport: {
      city: {
        h1: 'Equipamentos Desportivos em {city}',
        title: 'Compre e Venda Artigos de Desporto em {city} | Ambo Market',
        description: 'Encontre equipamentos de ginásio, bicicletas, pesos, bolas e mais. Compre ou venda artigos desportivos em {city} facilmente.',
      },
      everywhere: {
        h1: 'Equipamentos Desportivos',
        title: 'Compre e Venda Artigos de Desporto em Angola | Ambo Market',
        description: 'Explore anúncios de artigos desportivos em toda Angola. Publique seu anúncio ou encontre boas ofertas hoje.',
      },
    },
    music: {
      city: {
        h1: 'Instrumentos Musicais em {city}',
        title: 'Compre e Venda Guitarras, Teclados, Baterias e Mais em {city} | Ambo Market',
        description: 'Veja anúncios de instrumentos novos e usados. Encontre guitarras, teclados, tambores e mais em {city}. Anuncie gratuitamente.',
      },
      everywhere: {
        h1: 'Instrumentos Musicais',
        title: 'Compre e Venda Guitarras, Teclados, Baterias e Mais em Angola | Ambo Market',
        description: 'Instrumentos para iniciantes e profissionais. Publique ou explore anúncios em toda Angola hoje mesmo.',
      },
    },
    games: {
      city: {
        h1: 'Jogos e Consolas em {city}',
        title: 'Compre e Venda Consolas, Jogos de Tabuleiro e Acessórios em {city} | Ambo Market',
        description: 'Ofertas de PlayStation, Xbox, Nintendo, jogos de tabuleiro e mais. Publique seu anúncio ou encontre ofertas em {city}.',
      },
      everywhere: {
        h1: 'Jogos e Consolas',
        title: 'Compre e Venda Consolas, Jogos de Tabuleiro e Acessórios em Angola | Ambo Market',
        description: 'Explore consolas, jogos e acessórios em toda Angola. Anuncie ou compre com facilidade.',
      },
    },
    collectibles: {
      city: {
        h1: 'Colecionáveis e Antiguidades em {city}',
        title: 'Compre e Venda Selos, Moedas e Antiguidades em {city} | Ambo Market',
        description: 'Descubra peças raras – móveis antigos, arte, selos, moedas e mais em {city}. Publique ou explore anúncios únicos.',
      },
      everywhere: {
        h1: 'Colecionáveis e Antiguidades',
        title: 'Compre e Venda Selos, Moedas e Antiguidades em Angola | Ambo Market',
        description: 'Veja coleções vintage e antiguidades em toda Angola. Encontre ou publique tesouros especiais.',
      },
    },
    'other-hobby': {
      city: {
        h1: 'Outros Itens de Lazer em {city}',
        title: 'Compre e Venda Artigos de Lazer em {city} | Ambo Market',
        description: 'Anúncios de artesanato, puzzles, modelos e mais em {city}. Publique ou explore ofertas de passatempo.',
      },
      everywhere: {
        h1: 'Outros Itens de Lazer',
        title: 'Compre e Venda Artigos de Lazer em Angola | Ambo Market',
        description: 'Descubra produtos para hobbies e atividades criativas. Publique ou veja anúncios em Angola.',
      },
    },
  },
  kids: {
    clothes: {
      city: {
        h1: 'Roupas Infantis em {city}',
        title: 'Compre e Venda Roupas para Crianças em {city} | Ambo Market',
        description: 'Veja roupas novas e usadas para meninos e meninas em {city}. Casacos, camisas, calças e mais. Anuncie gratuitamente.',
      },
      everywhere: {
        h1: 'Roupas Infantis',
        title: 'Compre e Venda Roupas para Crianças em Angola | Ambo Market',
        description: 'Explore roupas infantis em toda Angola – para o dia a dia ou ocasiões especiais. Publique ou veja anúncios hoje mesmo.',
      },
    },
    toys: {
      city: {
        h1: 'Brinquedos e Jogos em {city}',
        title: 'Compre e Venda Brinquedos para Crianças em {city} | Ambo Market',
        description: 'Encontre bonecas, carrinhos, jogos educativos e muito mais em {city}. Diversão para todas as idades.',
      },
      everywhere: {
        h1: 'Brinquedos e Jogos',
        title: 'Compre e Venda Brinquedos para Crianças em Angola | Ambo Market',
        description: 'Descubra brinquedos para todas as idades – educativos, interativos e clássicos. Anuncie ou compre facilmente.',
      },
    },
    furniture: {
      city: {
        h1: 'Mobiliário Infantil em {city}',
        title: 'Compre Berços, Camas e Móveis Infantis em {city} | Ambo Market',
        description: 'Encontre camas, cadeiras altas, mesas e muito mais para crianças em {city}. Anuncie ou veja ofertas de móveis infantis.',
      },
      everywhere: {
        h1: 'Mobiliário Infantil',
        title: 'Compre Berços, Camas e Móveis Infantis em Angola | Ambo Market',
        description: 'Explore móveis para quartos de bebés e crianças. Anuncie ou compre em todo o país com facilidade.',
      },
    },
    'other-kids': {
      city: {
        h1: 'Outros Itens Infantis em {city}',
        title: 'Compre e Venda Produtos para Crianças em {city} | Ambo Market',
        description: 'Carrinhos de bebé, mochilas escolares, cadeirinhas e muito mais em {city}. Veja ou publique o seu anúncio gratuitamente.',
      },
      everywhere: {
        h1: 'Outros Itens Infantis',
        title: 'Compre e Venda Produtos para Crianças em Angola | Ambo Market',
        description: 'Veja produtos variados para bebés e crianças – acessórios, transporte, escola e mais. Anuncie ou encontre o que precisa.',
      },
    },
  },
  home: {
    furniture: {
      city: {
        h1: 'Móveis à Venda em {city}',
        title: 'Compre e Venda Mobiliário para Casa em {city} | Ambo Market',
        description: 'Sofás, mesas, cadeiras, roupeiros e muito mais. Encontre boas ofertas em {city} ou publique seu anúncio gratuitamente.',
      },
      everywhere: {
        h1: 'Móveis à Venda',
        title: 'Compre e Venda Mobiliário para Casa em Angola | Ambo Market',
        description: 'Veja anúncios de móveis novos e usados em toda Angola. Camas, prateleiras e muito mais. Publique ou compre com facilidade.',
      },
    },
    appliances: {
      city: {
        h1: 'Eletrodomésticos para Casa em {city}',
        title: 'Compre Frigoríficos, Máquinas, Micro-ondas e Mais em {city} | Ambo Market',
        description: 'Veja anúncios de eletrodomésticos para cozinha e casa em {city}. Compre novos ou usados. Anuncie gratuitamente.',
      },
      everywhere: {
        h1: 'Eletrodomésticos para Casa',
        title: 'Compre Frigoríficos, Máquinas, Micro-ondas e Mais em Angola | Ambo Market',
        description: 'Eletrodomésticos acessíveis em toda Angola. Publique ou veja anúncios de forma fácil.',
      },
    },
    tools: {
      city: {
        h1: 'Ferramentas e Itens de Bricolagem em {city}',
        title: 'Compre e Venda Ferramentas e Equipamentos em {city} | Ambo Market',
        description: 'Berbequins, martelos, escadas e mais. Publique ou explore ferramentas para obras e reparos em {city}.',
      },
      everywhere: {
        h1: 'Ferramentas e Itens de Bricolagem',
        title: 'Compre e Venda Ferramentas e Equipamentos em Angola | Ambo Market',
        description: 'Ferramentas para construção, reparos e uso doméstico. Veja anúncios ou publique os seus em Angola.',
      },
    },
    decor: {
      city: {
        h1: 'Decoração para Casa em {city}',
        title: 'Compre Itens Decorativos e de Interior em {city} | Ambo Market',
        description: 'Candeeiros, cortinas, tapetes, quadros e mais em {city}. Dê estilo à sua casa – veja ou publique anúncios agora.',
      },
      everywhere: {
        h1: 'Decoração para Casa',
        title: 'Compre Itens Decorativos e de Interior em Angola | Ambo Market',
        description: 'Veja artigos decorativos em toda Angola. Publique anúncios ou encontre o que falta na sua casa.',
      },
    },
    'other-home': {
      city: {
        h1: 'Outros Itens para Casa em {city}',
        title: 'Compre e Venda Artigos Domésticos em {city} | Ambo Market',
        description: 'Utensílios de cozinha, caixas de armazenamento e outros itens essenciais para casa em {city}. Anuncie ou explore ofertas.',
      },
      everywhere: {
        h1: 'Outros Itens para Casa',
        title: 'Compre e Venda Artigos Domésticos em Angola | Ambo Market',
        description: 'Veja uma variedade de itens para o lar em Angola. Publique o seu anúncio ou encontre o que precisa.',
      },
    },
  },
};

const fill = (str: string, vars: Record<string, string>) =>
  str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? _);


const {
  cityId,
  locationName,
  isPriorityCity,
  page,
  isLoading,
  fetchPosts,
  getFilter,
} = usePosts();

const route = useRoute();

const brands = computed(() => {
  const categoryId = route.params.categoryId as string;
  const subcategoryId = route.params.subcategoryId as string;
  const category = CATEGORIES.find(category => category.id === categoryId);
  const subcategory = category?.subcategories?.find(subcategory => subcategory.id === subcategoryId);

  return (subcategory?.brands || []).map(brand => ({
    title: brand.name,
    route: {
      name: 'cityId-categoryId-subcategoryId-brandId',
      params: {
        cityId: cityId.value,
        categoryId,
        subcategoryId,
        brandId: brand.id,
      },
    },
  }));
});

const breadcrumbs = computed(() => {
  const items = [];

  if (isPriorityCity.value) {
    const city = getCityById(cityId.value);

    items.push({
      title: city?.name || 'Página inicial',
      to: { name: 'cityId', params: { cityId: cityId.value } },
    });
  } else {
    items.push({ title: 'Página inicial', to: { name: 'index' } });
  }

  const categoryId = route.params.categoryId as string;

  items.push({
    title: getCategoryName(categoryId),
    to: { name: 'cityId-categoryId', params: { categoryId, cityId: cityId.value } },
  });

  const searchQuery = getFilter('q');
  const subcategoryId = route.params.subcategoryId as string;

  if (searchQuery) {
    items.push({
      title: getSubcategoryName(categoryId, subcategoryId),
      to: { name: 'cityId-categoryId-subcategoryId', params: { cityId: cityId.value, categoryId, subcategoryId } },
    });

    items.push({ title: searchQuery });
  } else {
    items.push({ title: getSubcategoryName(categoryId, subcategoryId) });
  }

  return items;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');
  const city = locationName.value;
  const categoryId = route.params.categoryId as string;
  const subcategoryId = route.params.subcategoryId as string;

  if (searchQuery) {
    const entry = isPriorityCity.value ? SEARCH_SEO.city : SEARCH_SEO.everywhere;

    return {
      h1: fill(entry.h1, { q: searchQuery, city }),
      title: fill(entry.title, { q: searchQuery, city }),
      description: fill(entry.description, { q: searchQuery, city }),
    };
  }

  const subSeo = SUBCATEGORY_SEO[categoryId]?.[subcategoryId];
  const entry = isPriorityCity.value ? subSeo?.city : subSeo?.everywhere;
  const subName = getSubcategoryName(categoryId, subcategoryId);
  const text = entry ?? { h1: subName, title: subName, description: '' };

  return {
    h1: fill(text.h1, { city }),
    title: fill(text.title, { city }),
    description: fill(text.description, { city }),
  };
});

const title = computed(() => seo.value.title);

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: seo.value.title },
  { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
  { key: 'description', name: 'description', content: seo.value.description },
  { key: 'og:description', property: 'og:description', content: seo.value.description },
  { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
]);

useHead({ title: title.value, meta: meta.value });


const { data: posts } = await useAsyncData(
  () => `posts:${route.fullPath}`,
  () => fetchPosts(),
  { watch: [() => [route.query, route.params]] },
);


const totalPages = computed(() => {
  const postsCount = posts.value?.resultsCount || 0;

  return Math.ceil(postsCount / MAX_POSTS_PER_PAGE);
});

const hasPagination = computed(() => totalPages.value > 1);

const setPage = (pageNumber: number) => {
  navigateTo({ query: { ...route.query, page: pageNumber } });
};
</script>

<template>
  <div class="space-y-4">
    <UIBreadcrumbs
      :items="breadcrumbs"
      class="hidden sm:flex"
    />

    <h1
      class="text-lg font-bold text-highlighted"
      v-text="seo.h1"
    />

    <CategoryPills :list="brands" />

    <div class="space-y-4">
      <ProductList
        :list="posts?.posts"
        :isLoading="isLoading"
      />

      <div
        v-if="hasPagination"
        class="flex justify-center"
      >
        <UPagination
          :page="page"
          :total="totalPages * MAX_POSTS_PER_PAGE"
          :itemsPerPage="MAX_POSTS_PER_PAGE"
          @update:page="setPage"
        />
      </div>

      <UITextRoll v-if="page === 1">
        <SeoCategoryText
          :title="seo.h1"
          :cityId="cityId"
          :categoryId="(route.params.categoryId as string)"
        />
      </UITextRoll>
    </div>
  </div>
</template>
