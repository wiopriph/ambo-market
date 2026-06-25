<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { getCityById } from '~/constants/cities';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';
import { getCategoryName, getSubcategoryName, getBrandName } from '~/constants/categories';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-brand',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});

type SeoEntry = { h1: string; title: string; description: string };

const SEARCH_SEO = {
  city: {
    h1: 'Anúncios para «{q}» em {city}',
    title: '{q} em {city} com os Melhores Preços | Ambo Market',
    description: 'Veja anúncios para {q} em {city}. Compre ou venda com fotos, avaliações e preços acessíveis 💸 em toda Angola. Publique grátis no Ambo Market.',
  },
  everywhere: {
    h1: 'Anúncios para «{q}»',
    title: '{q} com os Melhores Preços | Ambo Market',
    description: 'Encontre ofertas para {q} em todo o país. Produtos novos e usados 🤩 com avaliações 💬 e vendedores confiáveis. Anuncie gratuitamente.',
  },
};

const BRAND_SEO: Record<string, Record<string, { city: SeoEntry; everywhere: SeoEntry }>> = {
  motorcycles: {
    other: {
      city: {
        h1: 'Motos à Venda em {city}',
        title: 'Compre e Venda Motos em {city} | Ambo Market',
        description: 'Explore anúncios de várias marcas de motas em {city}. Publique seu anúncio gratuitamente.',
      },
      everywhere: {
        h1: 'Motos à Venda',
        title: 'Compre e Venda Motos em Angola | Ambo Market',
        description: 'Veja motas de diferentes marcas à venda em Angola. Anuncie ou compre com facilidade.',
      },
    },
    honda: {
      city: {
        h1: 'Motos Honda em {city}',
        title: 'Compre e Venda Motos Honda em {city} | Ambo Market',
        description: 'Encontre modelos Honda como CG, CBR, Africa Twin e outros em {city}.',
      },
      everywhere: {
        h1: 'Motos Honda',
        title: 'Compre e Venda Motos Honda em Angola | Ambo Market',
        description: 'Explore anúncios de Honda em toda Angola. Modelos populares e confiáveis.',
      },
    },
    yamaha: {
      city: {
        h1: 'Motos Yamaha em {city}',
        title: 'Compre e Venda Motos Yamaha em {city} | Ambo Market',
        description: 'Modelos como YBR, Fazer, MT-07 e mais disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Motos Yamaha',
        title: 'Compre e Venda Motos Yamaha em Angola | Ambo Market',
        description: 'Veja ofertas de Yamaha em Angola. Publique ou encontre boas oportunidades.',
      },
    },
    suzuki: {
      city: {
        h1: 'Motos Suzuki em {city}',
        title: 'Compre e Venda Motos Suzuki em {city} | Ambo Market',
        description: 'Descubra motos Suzuki como GSX, DR-Z e mais em {city}. Anuncie já.',
      },
      everywhere: {
        h1: 'Motos Suzuki',
        title: 'Compre e Venda Motos Suzuki em Angola | Ambo Market',
        description: 'Anúncios de motos Suzuki em Angola. Encontre modelos novos e usados.',
      },
    },
    kawasaki: {
      city: {
        h1: 'Motos Kawasaki em {city}',
        title: 'Compre e Venda Motos Kawasaki em {city} | Ambo Market',
        description: 'Veja modelos Kawasaki como Ninja, Versys, Z e outros em {city}.',
      },
      everywhere: {
        h1: 'Motos Kawasaki',
        title: 'Compre e Venda Motos Kawasaki em Angola | Ambo Market',
        description: 'Ofertas de Kawasaki em Angola. Potência, estilo e confiança em duas rodas.',
      },
    },
    vespa: {
      city: {
        h1: 'Scooters Vespa em {city}',
        title: 'Compre e Venda Vespa em {city} | Ambo Market',
        description: 'Clássica e elegante – encontre scooters Vespa em {city}. Anuncie gratuitamente.',
      },
      everywhere: {
        h1: 'Scooters Vespa',
        title: 'Compre e Venda Vespa em Angola | Ambo Market',
        description: 'Descubra o charme da Vespa em Angola. Scooters novas e usadas à venda.',
      },
    },
    ducati: {
      city: {
        h1: 'Motos Ducati em {city}',
        title: 'Compre e Venda Motos Ducati em {city} | Ambo Market',
        description: 'Performance italiana em duas rodas – veja Ducati Monster, Multistrada e outros.',
      },
      everywhere: {
        h1: 'Motos Ducati',
        title: 'Compre e Venda Motos Ducati em Angola | Ambo Market',
        description: 'Encontre motos Ducati à venda em Angola. Estilo e velocidade incomparáveis.',
      },
    },
    'bmw-motorrad': {
      city: {
        h1: 'BMW Motorrad em {city}',
        title: 'Compre e Venda BMW Motorrad em {city} | Ambo Market',
        description: 'Descubra motos BMW como GS, F 850, R 1250 e mais em {city}. Anuncie já.',
      },
      everywhere: {
        h1: 'BMW Motorrad',
        title: 'Compre e Venda BMW Motorrad em Angola | Ambo Market',
        description: 'Motos premium da BMW à venda em Angola. Conforto, potência e tecnologia.',
      },
    },
    'harley-davidson': {
      city: {
        h1: 'Harley-Davidson em {city}',
        title: 'Compre e Venda Harley-Davidson em {city} | Ambo Market',
        description: 'Clássicos americanos como Sportster, Softail, Road King e outros em {city}.',
      },
      everywhere: {
        h1: 'Harley-Davidson',
        title: 'Compre e Venda Harley-Davidson em Angola | Ambo Market',
        description: 'Sinta a liberdade com uma Harley-Davidson. Veja ofertas em Angola.',
      },
    },
    aprilia: {
      city: {
        h1: 'Motos Aprilia em {city}',
        title: 'Compre e Venda Motos Aprilia em {city} | Ambo Market',
        description: 'Motos Aprilia como RSV4, Tuareg e SR GT disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Motos Aprilia',
        title: 'Compre e Venda Motos Aprilia em Angola | Ambo Market',
        description: 'Desempenho italiano e design marcante – veja Aprilia em Angola.',
      },
    },
  },
  cars: {
    other: {
      city: {
        h1: 'Carros à Venda em {city}',
        title: 'Compre e Venda Carros em {city} | Ambo Market',
        description: 'Veja ofertas de diversas marcas de carros em {city}. Anuncie o seu gratuitamente.',
      },
      everywhere: {
        h1: 'Carros à Venda',
        title: 'Compre e Venda Carros em Angola | Ambo Market',
        description: 'Encontre carros de várias marcas à venda em Angola. Publique ou explore anúncios com facilidade.',
      },
    },
    toyota: {
      city: {
        h1: 'Toyota à Venda em {city}',
        title: 'Compre e Venda Toyota em {city} | Ambo Market',
        description: 'Modelos como Hilux, Corolla e Land Cruiser em {city}. Apenas vendedores confiáveis.',
      },
      everywhere: {
        h1: 'Toyota à Venda',
        title: 'Compre e Venda Toyota em Angola | Ambo Market',
        description: 'Ofertas de Toyota em toda Angola – desde modelos económicos até premium.',
      },
    },
    suzuki: {
      city: {
        h1: 'Suzuki à Venda em {city}',
        title: 'Compre e Venda Suzuki em {city} | Ambo Market',
        description: 'Veja anúncios de Suzuki Swift, Vitara, Jimny e outros em {city}.',
      },
      everywhere: {
        h1: 'Suzuki à Venda',
        title: 'Compre e Venda Suzuki em Angola | Ambo Market',
        description: 'Encontre ofertas de Suzuki em Angola. Vendedores verificados e bons preços.',
      },
    },
    hyundai: {
      city: {
        h1: 'Hyundai à Venda em {city}',
        title: 'Compre e Venda Hyundai em {city} | Ambo Market',
        description: 'Veja modelos Hyundai como Tucson, Accent e Elantra em {city}.',
      },
      everywhere: {
        h1: 'Hyundai à Venda',
        title: 'Compre e Venda Hyundai em Angola | Ambo Market',
        description: 'Carros Hyundai novos e usados à venda em toda Angola.',
      },
    },
    kia: {
      city: {
        h1: 'Kia à Venda em {city}',
        title: 'Compre e Venda Kia em {city} | Ambo Market',
        description: 'Procura por Kia Sportage, Rio, Picanto e mais em {city}.',
      },
      everywhere: {
        h1: 'Kia à Venda',
        title: 'Compre e Venda Kia em Angola | Ambo Market',
        description: 'Kia à venda em Angola. Veja ou publique anúncios facilmente.',
      },
    },
    mitsubishi: {
      city: {
        h1: 'Mitsubishi em {city}',
        title: 'Compre e Venda Mitsubishi em {city} | Ambo Market',
        description: 'Veja Pajero, L200 e outros modelos Mitsubishi em {city}. Anuncie de graça.',
      },
      everywhere: {
        h1: 'Mitsubishi',
        title: 'Compre e Venda Mitsubishi em Angola | Ambo Market',
        description: 'Modelos Mitsubishi disponíveis em toda Angola. Anúncios verificados.',
      },
    },
    chevrolet: {
      city: {
        h1: 'Chevrolet à Venda em {city}',
        title: 'Compre e Venda Chevrolet em {city} | Ambo Market',
        description: 'Veja Chevrolet Spark, Aveo, Trailblazer e mais em {city}.',
      },
      everywhere: {
        h1: 'Chevrolet à Venda',
        title: 'Compre e Venda Chevrolet em Angola | Ambo Market',
        description: 'Anúncios de Chevrolet em Angola. Bons preços e vendedores confiáveis.',
      },
    },
    nissan: {
      city: {
        h1: 'Nissan à Venda em {city}',
        title: 'Compre e Venda Nissan em {city} | Ambo Market',
        description: 'Encontre modelos como Navara, Patrol, Micra e outros em {city}.',
      },
      everywhere: {
        h1: 'Nissan à Venda',
        title: 'Compre e Venda Nissan em Angola | Ambo Market',
        description: 'Veja anúncios de Nissan em toda Angola. Ótimos preços e boa oferta.',
      },
    },
    renault: {
      city: {
        h1: 'Renault em {city}',
        title: 'Compre e Venda Renault em {city} | Ambo Market',
        description: 'Clio, Duster, Kwid e mais disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Renault',
        title: 'Compre e Venda Renault em Angola | Ambo Market',
        description: 'Anúncios atualizados de Renault em toda Angola. Novos e usados.',
      },
    },
    ford: {
      city: {
        h1: 'Ford à Venda em {city}',
        title: 'Compre e Venda Ford em {city} | Ambo Market',
        description: 'Modelos como Ranger, EcoSport, Focus disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Ford à Venda',
        title: 'Compre e Venda Ford em Angola | Ambo Market',
        description: 'Ford para uso pessoal ou profissional. Veja anúncios em Angola.',
      },
    },
    mercedes: {
      city: {
        h1: 'Mercedes-Benz em {city}',
        title: 'Compre e Venda Mercedes em {city} | Ambo Market',
        description: 'Modelos como E-Class, C-Class e outros à venda em {city}.',
      },
      everywhere: {
        h1: 'Mercedes-Benz',
        title: 'Compre e Venda Mercedes-Benz em Angola | Ambo Market',
        description: 'Explore carros Mercedes em Angola. Anúncios de confiança.',
      },
    },
    volkswagen: {
      city: {
        h1: 'Volkswagen em {city}',
        title: 'Compre e Venda Volkswagen em {city} | Ambo Market',
        description: 'Modelos VW como Golf, Polo, Passat disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Volkswagen',
        title: 'Compre e Venda Volkswagen em Angola | Ambo Market',
        description: 'Volkswagen à venda em Angola. Anuncie ou explore boas ofertas.',
      },
    },
    bmw: {
      city: {
        h1: 'BMW em {city}',
        title: 'Compre e Venda BMW em {city} | Ambo Market',
        description: 'Modelos BMW Série 3, X5 e mais à venda em {city}. Carros premium.',
      },
      everywhere: {
        h1: 'BMW',
        title: 'Compre e Venda BMW em Angola | Ambo Market',
        description: 'Veja carros BMW em Angola. Novos e usados, sempre com qualidade.',
      },
    },
    jetour: {
      city: {
        h1: 'Jetour à Venda em {city}',
        title: 'Compre e Venda Jetour em {city} | Ambo Market',
        description: 'SUVs e crossovers Jetour disponíveis em {city}. Ótimas ofertas locais.',
      },
      everywhere: {
        h1: 'Jetour à Venda',
        title: 'Compre e Venda Jetour em Angola | Ambo Market',
        description: 'Jetour à venda em Angola. Modernos, acessíveis e com bom custo-benefício.',
      },
    },
  },
  phones: {
    other: {
      city: {
        h1: 'Telemóveis à Venda em {city}',
        title: 'Compre e Venda Telemóveis em {city} | Ambo Market',
        description: 'Explore anúncios de várias marcas de telemóveis em {city}. Publique o seu gratuitamente.',
      },
      everywhere: {
        h1: 'Telemóveis à Venda',
        title: 'Compre e Venda Telemóveis em Angola | Ambo Market',
        description: 'Veja telemóveis de todas as marcas à venda em Angola. Apenas anúncios verificados.',
      },
    },
    apple: {
      city: {
        h1: 'iPhones à Venda em {city}',
        title: 'Compre e Venda Apple iPhones em {city} | Ambo Market',
        description: 'Encontre iPhones à venda em {city} – modelos 14, 13, 12 e mais. Boas ofertas disponíveis.',
      },
      everywhere: {
        h1: 'iPhones à Venda',
        title: 'Compre e Venda Apple iPhones em Angola | Ambo Market',
        description: 'Explore iPhones novos, usados e recondicionados em toda Angola.',
      },
    },
    samsung: {
      city: {
        h1: 'Telemóveis Samsung em {city}',
        title: 'Compre e Venda Samsung em {city} | Ambo Market',
        description: 'Procure modelos Samsung Galaxy – S, A, Note e outros em {city}.',
      },
      everywhere: {
        h1: 'Telemóveis Samsung',
        title: 'Compre e Venda Samsung em Angola | Ambo Market',
        description: 'Telemóveis Samsung à venda em Angola. Novos e usados disponíveis.',
      },
    },
    itel: {
      city: {
        h1: 'Telemóveis itel em {city}',
        title: 'Compre e Venda itel em {city} | Ambo Market',
        description: 'Telemóveis itel baratos à venda em {city}. Perfeitos para uso diário. Anuncie ou compre agora.',
      },
      everywhere: {
        h1: 'Telemóveis itel',
        title: 'Compre e Venda itel em Angola | Ambo Market',
        description: 'Encontre opções económicas e confiáveis de itel em Angola. Novos e usados.',
      },
    },
    tecno: {
      city: {
        h1: 'Telemóveis TECNO em {city}',
        title: 'Compre e Venda TECNO em {city} | Ambo Market',
        description: 'Encontre modelos TECNO Spark, Camon, Pop e outros em {city}. Boas ofertas.',
      },
      everywhere: {
        h1: 'Telemóveis TECNO',
        title: 'Compre e Venda TECNO em Angola | Ambo Market',
        description: 'Explore smartphones TECNO em Angola. Potência, preço justo e qualidade.',
      },
    },
    xiaomi: {
      city: {
        h1: 'Telemóveis Xiaomi em {city}',
        title: 'Compre e Venda Xiaomi em {city} | Ambo Market',
        description: 'Veja modelos Xiaomi Redmi, Poco e Mi Series à venda em {city}.',
      },
      everywhere: {
        h1: 'Telemóveis Xiaomi',
        title: 'Compre e Venda Xiaomi em Angola | Ambo Market',
        description: 'Telemóveis Xiaomi com ótimo desempenho e preços acessíveis em Angola.',
      },
    },
    huawei: {
      city: {
        h1: 'Telemóveis Huawei em {city}',
        title: 'Compre e Venda Huawei em {city} | Ambo Market',
        description: 'Huawei Nova, P Series, Mate Series e mais à venda em {city}. Publique ou compre agora.',
      },
      everywhere: {
        h1: 'Telemóveis Huawei',
        title: 'Compre e Venda Huawei em Angola | Ambo Market',
        description: 'Veja ofertas de Huawei em toda Angola. Modelos novos e usados disponíveis.',
      },
    },
    oppo: {
      city: {
        h1: 'Telemóveis OPPO em {city}',
        title: 'Compre e Venda OPPO em {city} | Ambo Market',
        description: 'Modelos OPPO A Series, Reno Series e outros disponíveis em {city}. Publique seu anúncio.',
      },
      everywhere: {
        h1: 'Telemóveis OPPO',
        title: 'Compre e Venda OPPO em Angola | Ambo Market',
        description: 'Telemóveis OPPO à venda em Angola – design moderno e bom desempenho.',
      },
    },
  },
  computers: {
    other: {
      city: {
        h1: 'Computadores em {city}',
        title: 'Comprar e Vender Computadores em {city} | Ambo Market',
        description: 'Veja computadores de várias marcas em {city} – opções acessíveis e confiáveis disponíveis.',
      },
      everywhere: {
        h1: 'Computadores em Angola',
        title: 'Comprar e Vender Computadores em Angola | Ambo Market',
        description: 'Explore uma ampla variedade de computadores em Angola – diferentes marcas, modelos e preços.',
      },
    },
    hp: {
      city: {
        h1: 'Computadores HP em {city}',
        title: 'Compre e Venda HP em {city} | Ambo Market',
        description: 'Encontre laptops e PCs HP em {city} – modelos Pavilion, EliteBook, ProBook e mais.',
      },
      everywhere: {
        h1: 'Computadores HP',
        title: 'Compre e Venda HP em Angola | Ambo Market',
        description: 'Explore computadores HP à venda em toda Angola. Novos e usados com bons preços.',
      },
    },
    dell: {
      city: {
        h1: 'Computadores Dell em {city}',
        title: 'Compre e Venda Dell em {city} | Ambo Market',
        description: 'Dell Inspiron, Latitude, XPS e outros modelos disponíveis em {city}. Publique ou compre.',
      },
      everywhere: {
        h1: 'Computadores Dell',
        title: 'Compre e Venda Dell em Angola | Ambo Market',
        description: 'Descubra laptops e desktops Dell em Angola. Alta performance e confiabilidade.',
      },
    },
    asus: {
      city: {
        h1: 'Computadores ASUS em {city}',
        title: 'Compre e Venda ASUS em {city} | Ambo Market',
        description: 'Veja modelos ASUS como VivoBook, ZenBook e TUF Gaming à venda em {city}.',
      },
      everywhere: {
        h1: 'Computadores ASUS',
        title: 'Compre e Venda ASUS em Angola | Ambo Market',
        description: 'Computadores ASUS para trabalho, estudos ou jogos disponíveis em Angola.',
      },
    },
    lenovo: {
      city: {
        h1: 'Computadores Lenovo em {city}',
        title: 'Compre e Venda Lenovo em {city} | Ambo Market',
        description: 'Modelos Lenovo Ideapad, ThinkPad, Legion e mais em {city}. Boas ofertas.',
      },
      everywhere: {
        h1: 'Computadores Lenovo',
        title: 'Compre e Venda Lenovo em Angola | Ambo Market',
        description: 'Encontre Lenovo para negócios, casa ou jogos em Angola. Novos e usados.',
      },
    },
    apple: {
      city: {
        h1: 'Computadores Apple em {city}',
        title: 'Compre e Venda Apple MacBook em {city} | Ambo Market',
        description: 'Encontre MacBook Air, MacBook Pro e iMacs em {city}. Postar ou comprar com segurança.',
      },
      everywhere: {
        h1: 'Computadores Apple',
        title: 'Compre e Venda Apple em Angola | Ambo Market',
        description: 'Explore Apple MacBooks e iMacs em Angola. Tecnologia premium e design elegante.',
      },
    },
    acer: {
      city: {
        h1: 'Computadores Acer em {city}',
        title: 'Compre e Venda Acer em {city} | Ambo Market',
        description: 'Laptops Acer Aspire, Nitro, Swift e mais à venda em {city}.',
      },
      everywhere: {
        h1: 'Computadores Acer',
        title: 'Compre e Venda Acer em Angola | Ambo Market',
        description: 'Computadores Acer para todos os orçamentos. Explore ofertas em Angola.',
      },
    },
    msi: {
      city: {
        h1: 'Computadores MSI em {city}',
        title: 'Compre e Venda MSI em {city} | Ambo Market',
        description: 'Portáteis e desktops MSI para gamers e profissionais em {city}.',
      },
      everywhere: {
        h1: 'Computadores MSI',
        title: 'Compre e Venda MSI em Angola | Ambo Market',
        description: 'MSI à venda em Angola – alto desempenho para jogos e criação de conteúdo.',
      },
    },
    huawei: {
      city: {
        h1: 'Computadores Huawei em {city}',
        title: 'Compre e Venda Huawei em {city} | Ambo Market',
        description: 'Laptops Huawei MateBook e outros modelos disponíveis em {city}.',
      },
      everywhere: {
        h1: 'Computadores Huawei',
        title: 'Compre e Venda Huawei em Angola | Ambo Market',
        description: 'Encontre Huawei MateBooks com ótimo design e performance em Angola.',
      },
    },
  },
  gaming: {
    sony: {
      city: {
        h1: 'PlayStation da Sony em {city}',
        title: 'Compre e Venda PlayStation em {city} | Ambo Market',
        description: 'Encontre PS5, PS4 e acessórios à venda em {city}. Explore os anúncios ou publique o seu.',
      },
      everywhere: {
        h1: 'PlayStation da Sony',
        title: 'Compre e Venda PlayStation em Angola | Ambo Market',
        description: 'Consolas e jogos PlayStation à venda em toda Angola. Anúncios verificados e bons preços.',
      },
    },
    microsoft: {
      city: {
        h1: 'Consolas Xbox em {city}',
        title: 'Compre e Venda Xbox da Microsoft em {city} | Ambo Market',
        description: 'Veja Xbox Series X, Series S, Xbox One e acessórios em {city}. Publique ou explore anúncios.',
      },
      everywhere: {
        h1: 'Consolas Xbox',
        title: 'Compre e Venda Xbox em Angola | Ambo Market',
        description: 'Explore consolas, jogos e acessórios Xbox disponíveis em Angola.',
      },
    },
    nintendo: {
      city: {
        h1: 'Consolas Nintendo em {city}',
        title: 'Compre e Venda Nintendo em {city} | Ambo Market',
        description: 'Encontre Nintendo Switch, Wii, 3DS e mais em {city}. Ótimas opções para toda a família.',
      },
      everywhere: {
        h1: 'Consolas Nintendo',
        title: 'Compre e Venda Nintendo em Angola | Ambo Market',
        description: 'Consolas e jogos Nintendo à venda em Angola. Novos e usados disponíveis.',
      },
    },
    valve: {
      city: {
        h1: 'Steam Deck da Valve em {city}',
        title: 'Compre e Venda Steam Deck em {city} | Ambo Market',
        description: 'Jogue onde quiser com o Steam Deck. Veja anúncios em {city} ou publique o seu.',
      },
      everywhere: {
        h1: 'Steam Deck da Valve',
        title: 'Compre e Venda Steam Deck em Angola | Ambo Market',
        description: 'Compre o Steam Deck em Angola – consola portátil de alto desempenho para jogos de PC.',
      },
    },
    other: {
      city: {
        h1: 'Consolas de Jogo à Venda em {city}',
        title: 'Compre e Venda Consolas em {city} | Ambo Market',
        description: 'Procura consolas de outras marcas ou modelos retro em {city}? Publique ou veja anúncios agora.',
      },
      everywhere: {
        h1: 'Consolas de Jogo à Venda',
        title: 'Compre e Venda Consolas em Angola | Ambo Market',
        description: 'Consolas modernas, portáteis e clássicas à venda em Angola. Explore ou anuncie já.',
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

  const subcategoryId = route.params.subcategoryId as string;

  items.push({
    title: getSubcategoryName(categoryId, subcategoryId),
    to: { name: 'cityId-categoryId-subcategoryId', params: { cityId: cityId.value, categoryId, subcategoryId } },
  });

  const brandId = route.params.brandId as string;
  const searchQuery = getFilter('q');

  if (searchQuery) {
    items.push({
      title: getBrandName(categoryId, subcategoryId, brandId),
      to: {
        name: 'cityId-categoryId-subcategoryId-brandId',
        params: { cityId: cityId.value, categoryId, subcategoryId, brandId },
      },
    });

    items.push({ title: searchQuery });
  } else {
    items.push({ title: getBrandName(categoryId, subcategoryId, brandId) });
  }

  return items;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');
  const city = locationName.value;
  const subcategoryId = route.params.subcategoryId as string;
  const brandId = route.params.brandId as string;
  const categoryId = route.params.categoryId as string;

  if (searchQuery) {
    const entry = isPriorityCity.value ? SEARCH_SEO.city : SEARCH_SEO.everywhere;

    return {
      h1: fill(entry.h1, { q: searchQuery, city }),
      title: fill(entry.title, { q: searchQuery, city }),
      description: fill(entry.description, { q: searchQuery, city }),
    };
  }

  const brandSeo = BRAND_SEO[subcategoryId]?.[brandId];
  const entry = isPriorityCity.value ? brandSeo?.city : brandSeo?.everywhere;
  const brandName = getBrandName(categoryId, subcategoryId, brandId);
  const text = entry ?? { h1: brandName, title: brandName, description: '' };

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
  <div class="mx-auto px-4 sm:px-5 py-4 sm:py-6 space-y-4">
    <UIBreadcrumbs
      :items="breadcrumbs"
      class="hidden sm:flex"
    />

    <h1
      class="text-lg font-bold text-highlighted"
      v-text="seo.h1"
    />

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
    </div>
  </div>
</template>

