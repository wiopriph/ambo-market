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
    title: '{q} em {city} – Anúncios de Particulares e Empresas | Ambo Market',
    description: 'Veja anúncios de {q} em {city}: novos e segunda mão, com fotos, preços e avaliações. Compre ou venda com segurança. Publique grátis no Ambo Market.',
  },
  everywhere: {
    h1: 'Anúncios para «{q}»',
    title: '{q} à Venda em Angola – Classificados Grátis | Ambo Market',
    description: 'Encontre {q} em toda Angola – Luanda, Benguela, Huambo e mais. Produtos novos e usados de particulares e empresas. Anuncie gratuitamente no Ambo Market.',
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
        title: 'Motos Honda Novas e Usadas em {city} – CG, CBR, Africa Twin | Ambo Market',
        description: 'Honda em {city}: CG 150, CBR 600, CB 500, Africa Twin e scooters. Novos e usados de particulares. Compare preços e negocie. Anuncie a sua Honda grátis.',
      },
      everywhere: {
        h1: 'Motos Honda',
        title: 'Motos Honda em Angola – CG, CBR, Africa Twin, Novas e Usadas | Ambo Market',
        description: 'Motos Honda à venda em Angola: CG, CBR, CB, XRE, Africa Twin, PCX e mais. Novos e segunda mão de particulares e revendedores. Anuncie grátis no Ambo Market.',
      },
    },
    yamaha: {
      city: {
        h1: 'Motos Yamaha em {city}',
        title: 'Motos Yamaha Novas e Usadas em {city} – YBR, Fazer, MT | Ambo Market',
        description: 'Yamaha em {city}: YBR 125, Fazer 250, MT-07, MT-09, R1 e mais. Novos e usados a bons preços. Compare ofertas e anuncie a sua Yamaha grátis.',
      },
      everywhere: {
        h1: 'Motos Yamaha',
        title: 'Motos Yamaha em Angola – YBR, Fazer, MT-07, R1 | Ambo Market',
        description: 'Motas Yamaha à venda em Angola: YBR, Fazer, NMAX, MT-07, MT-09, R1 e crosseiros. Novos e usados de particulares. Preços competitivos. Anuncie grátis.',
      },
    },
    suzuki: {
      city: {
        h1: 'Motos Suzuki em {city}',
        title: 'Motos Suzuki Novas e Usadas em {city} – GSX, DR-Z, Intruder | Ambo Market',
        description: 'Suzuki em {city}: GSX-R, DR-Z, Intruder, V-Strom e mais. Novos e usados de particulares. Anuncie ou compre com segurança no Ambo Market.',
      },
      everywhere: {
        h1: 'Motos Suzuki',
        title: 'Motos Suzuki em Angola – GSX, DR-Z, V-Strom | Ambo Market',
        description: 'Motas Suzuki à venda em Angola: GSX-R, DR-Z 400, V-Strom, Intruder e scooters. Novos e segunda mão. Particulares e concessionárias. Anuncie grátis.',
      },
    },
    kawasaki: {
      city: {
        h1: 'Motos Kawasaki em {city}',
        title: 'Motos Kawasaki Novas e Usadas em {city} – Ninja, Z, Versys | Ambo Market',
        description: 'Kawasaki em {city}: Ninja 400, Z900, Versys, KLX e mais. Desempenho e fiabilidade. Anuncie ou compre com segurança no Ambo Market.',
      },
      everywhere: {
        h1: 'Motos Kawasaki',
        title: 'Motos Kawasaki em Angola – Ninja, Z900, Versys | Ambo Market',
        description: 'Kawasaki à venda em Angola: Ninja 400, Ninja 650, Z900, Versys 650, KLX e Z125. Potência e estilo. Novos e usados. Anuncie grátis no Ambo Market.',
      },
    },
    vespa: {
      city: {
        h1: 'Scooters Vespa em {city}',
        title: 'Scooters Vespa Novas e Usadas em {city} – GTS, Primavera, Sprint | Ambo Market',
        description: 'Vespa em {city}: GTS 300, Primavera, Sprint e modelos clássicos. Ícone italiano de mobilidade urbana. Anuncie ou compre com segurança.',
      },
      everywhere: {
        h1: 'Scooters Vespa',
        title: 'Vespa em Angola – GTS, Primavera, Sprint, Novas e Usadas | Ambo Market',
        description: 'Scooters Vespa à venda em Angola: GTS 300, Primavera 125, Sprint e edições especiais. Elegância e praticidade urbana. Anuncie grátis no Ambo Market.',
      },
    },
    ducati: {
      city: {
        h1: 'Motos Ducati em {city}',
        title: 'Motos Ducati Novas e Usadas em {city} – Monster, Multistrada | Ambo Market',
        description: 'Ducati em {city}: Monster 937, Multistrada V4, Panigale, Scrambler e mais. Performance italiana. Anuncie ou compre com segurança no Ambo Market.',
      },
      everywhere: {
        h1: 'Motos Ducati',
        title: 'Motos Ducati em Angola – Monster, Multistrada, Panigale | Ambo Market',
        description: 'Ducati à venda em Angola: Monster, Multistrada V4, Panigale V4, Scrambler e Diavel. Estilo e desempenho incomparáveis. Anuncie grátis no Ambo Market.',
      },
    },
    'bmw-motorrad': {
      city: {
        h1: 'BMW Motorrad em {city}',
        title: 'Motos BMW Novas e Usadas em {city} – GS, R 1250, F 850 | Ambo Market',
        description: 'BMW Motorrad em {city}: R 1250 GS, F 850 GS, S 1000 RR, R 18 e mais. Tecnologia premium em duas rodas. Anuncie ou compre com segurança.',
      },
      everywhere: {
        h1: 'BMW Motorrad',
        title: 'Motos BMW em Angola – R 1250 GS, F 850 GS, S 1000 RR | Ambo Market',
        description: 'BMW Motorrad à venda em Angola: R 1250 GS, F 850 GS, S 1000 RR, C 400 X. Conforto, segurança e potência. Novos e usados. Anuncie grátis.',
      },
    },
    'harley-davidson': {
      city: {
        h1: 'Harley-Davidson em {city}',
        title: 'Harley-Davidson em {city} – Sportster, Softail, Road King | Ambo Market',
        description: 'Harley-Davidson em {city}: Sportster, Softail, Road King, Street Glide e Fat Boy. Clássicos americanos a preços competitivos. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Harley-Davidson',
        title: 'Harley-Davidson em Angola – Sportster, Softail, Road King | Ambo Market',
        description: 'Harley-Davidson à venda em Angola: Sportster 1200, Softail, Road King, Street Glide e mais. Liberdade na estrada. Novos e usados. Anuncie grátis.',
      },
    },
    aprilia: {
      city: {
        h1: 'Motos Aprilia em {city}',
        title: 'Motos Aprilia Novas e Usadas em {city} – RSV4, Tuareg, SR | Ambo Market',
        description: 'Aprilia em {city}: RSV4, Tuono V4, Tuareg 660, SR GT e mais. Desempenho italiano de pista e estrada. Anuncie ou compre com segurança.',
      },
      everywhere: {
        h1: 'Motos Aprilia',
        title: 'Motos Aprilia em Angola – RSV4, Tuareg, Tuono, SR GT | Ambo Market',
        description: 'Aprilia à venda em Angola: RSV4, Tuono V4, Tuareg 660, SR GT 125 e mais. Design arrojado e desempenho de pista. Novos e usados. Anuncie grátis.',
      },
    },
  },
  cars: {
    other: {
      city: {
        h1: 'Carros à Venda em {city}',
        title: 'Carros Novos e Usados em {city} – Todas as Marcas | Ambo Market',
        description: 'Carros à venda em {city}: Toyota, Hyundai, Kia, Mitsubishi, Nissan, Ford e mais. Novos e segunda mão de particulares e empresas. Anuncie o seu gratuitamente.',
      },
      everywhere: {
        h1: 'Carros à Venda',
        title: 'Carros Novos e Usados em Angola – Toyota, Hyundai, Kia, Nissan | Ambo Market',
        description: 'Carros à venda em Angola: todas as marcas, novos e segunda mão. Toyota, Hyundai, Kia, Mitsubishi, Ford, Nissan e mais. Anuncie grátis no Ambo Market.',
      },
    },
    toyota: {
      city: {
        h1: 'Toyota à Venda em {city}',
        title: 'Toyota Hilux, Corolla, Land Cruiser em {city} – Novos e Usados | Ambo Market',
        description: 'Toyota à venda em {city}: Hilux, Corolla, Land Cruiser, RAV4, Prado e Fortuner. Novos e usados, de particulares e concessionárias. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Toyota à Venda',
        title: 'Toyota em Angola – Hilux, Land Cruiser, Corolla, RAV4 | Ambo Market',
        description: 'Toyota à venda em Angola: Hilux pickup, Land Cruiser Prado, Corolla, RAV4, Fortuner e Camry. A marca mais fiável de Angola. Novos e usados. Anuncie grátis.',
      },
    },
    suzuki: {
      city: {
        h1: 'Suzuki à Venda em {city}',
        title: 'Suzuki Swift, Vitara, Jimny e Grand Vitara em {city} | Ambo Market',
        description: 'Suzuki à venda em {city}: Swift, Vitara, Jimny, Grand Vitara e S-Presso. Económicos e 4x4 para Angola. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Suzuki à Venda',
        title: 'Suzuki em Angola – Swift, Vitara, Jimny, Grand Vitara | Ambo Market',
        description: 'Suzuki à venda em Angola: Swift, Vitara, Jimny 4x4, Grand Vitara e S-Presso. Económicos e robustos para as estradas angolanas. Anuncie grátis.',
      },
    },
    hyundai: {
      city: {
        h1: 'Hyundai à Venda em {city}',
        title: 'Hyundai Tucson, Accent, Elantra, i10 em {city} – Novos e Usados | Ambo Market',
        description: 'Hyundai à venda em {city}: Tucson, Santa Fe, Accent, Elantra, i10 e i20. Qualidade e bom custo-benefício. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Hyundai à Venda',
        title: 'Hyundai em Angola – Tucson, Santa Fe, Accent, Elantra | Ambo Market',
        description: 'Hyundai à venda em Angola: Tucson, Santa Fe, Accent, Elantra, i10 e mais. Qualidade coreana a preços competitivos. Novos e usados. Anuncie grátis.',
      },
    },
    kia: {
      city: {
        h1: 'Kia à Venda em {city}',
        title: 'Kia Sportage, Picanto, Rio, Sorento em {city} – Novos e Usados | Ambo Market',
        description: 'Kia à venda em {city}: Sportage, Picanto, Rio, Sorento e Cerato. Design moderno e boa eficiência. Novos e usados de particulares. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Kia à Venda',
        title: 'Kia em Angola – Sportage, Picanto, Rio, Sorento | Ambo Market',
        description: 'Kia à venda em Angola: Sportage SUV, Picanto, Rio, Sorento e Cerato. Fiabilidade e design moderno. Novos e usados. Particulares e empresas. Anuncie grátis.',
      },
    },
    mitsubishi: {
      city: {
        h1: 'Mitsubishi em {city}',
        title: 'Mitsubishi Pajero, L200, Outlander em {city} – Novos e Usados | Ambo Market',
        description: 'Mitsubishi à venda em {city}: Pajero Sport, L200 Triton, Outlander, Eclipse Cross. 4x4 robustos para Angola. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Mitsubishi',
        title: 'Mitsubishi em Angola – Pajero, L200 Triton, Outlander | Ambo Market',
        description: 'Mitsubishi à venda em Angola: Pajero Sport, L200 Triton, Outlander e Eclipse Cross. 4x4 resistentes para estradas angolanas. Novos e usados. Anuncie grátis.',
      },
    },
    chevrolet: {
      city: {
        h1: 'Chevrolet à Venda em {city}',
        title: 'Chevrolet Spark, Trailblazer, S10 em {city} – Novos e Usados | Ambo Market',
        description: 'Chevrolet à venda em {city}: Spark, Onix, Trailblazer, S10 e Captiva. Versáteis para cidade e campo. Novos e usados. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Chevrolet à Venda',
        title: 'Chevrolet em Angola – Spark, Onix, Trailblazer, S10 | Ambo Market',
        description: 'Chevrolet à venda em Angola: Spark, Onix, Trailblazer 4x4, S10 pickup e Captiva. Para todos os perfis. Novos e usados de particulares. Anuncie grátis.',
      },
    },
    nissan: {
      city: {
        h1: 'Nissan à Venda em {city}',
        title: 'Nissan Navara, Patrol, X-Trail em {city} – Novos e Usados | Ambo Market',
        description: 'Nissan à venda em {city}: Navara, Patrol, X-Trail, Micra e Note. Robustos e económicos. Novos e usados de particulares. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Nissan à Venda',
        title: 'Nissan em Angola – Navara, Patrol, X-Trail | Ambo Market',
        description: 'Nissan à venda em Angola: Navara pickup, Patrol 4x4, X-Trail, Micra e Note. Fiáveis para qualquer terreno. Novos e usados. Anuncie grátis no Ambo Market.',
      },
    },
    renault: {
      city: {
        h1: 'Renault em {city}',
        title: 'Renault Duster, Clio, Kwid, Logan em {city} – Novos e Usados | Ambo Market',
        description: 'Renault à venda em {city}: Duster, Clio, Kwid, Logan e Sandero. Económicos e práticos. Novos e usados de particulares. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Renault',
        title: 'Renault em Angola – Duster, Clio, Kwid, Logan | Ambo Market',
        description: 'Renault à venda em Angola: Duster SUV, Clio, Kwid, Logan e Sandero. Custo-benefício europeu. Novos e usados de particulares e importadores. Anuncie grátis.',
      },
    },
    ford: {
      city: {
        h1: 'Ford à Venda em {city}',
        title: 'Ford Ranger, EcoSport, Territory em {city} – Novos e Usados | Ambo Market',
        description: 'Ford à venda em {city}: Ranger pickup, EcoSport, Territory, Focus e Fiesta. Para todos os perfis. Novos e usados de particulares. Anuncie grátis.',
      },
      everywhere: {
        h1: 'Ford à Venda',
        title: 'Ford em Angola – Ranger, EcoSport, Territory | Ambo Market',
        description: 'Ford à venda em Angola: Ranger 4x4, EcoSport, Territory SUV, Focus e Transit. Para uso pessoal e comercial. Novos e usados. Anuncie grátis no Ambo Market.',
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

