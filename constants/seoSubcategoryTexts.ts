// SEO-тексты для страниц подкатегорий (/[city]/[category]/[subcategory]).
// Подменяют intro/body/cta общекатегорийного текста в SeoCategoryText.
// Приоритет: бренд > подкатегория > категория. loc — город или «Angola».

import type { BrandSeoText as SubcategorySeoText } from '~/constants/seoBrandTexts';


export const SUBCATEGORY_SEO_TEXTS: Record<string, Record<string, (loc: string) => SubcategorySeoText>> = {
  vehicles: {
    cars: loc => ({
      intro: `Compre ou venda carros em ${loc} no Ambo Market. Toyota Hilux, Land Cruiser, Hyundai Tucson, Kia Sportage, Suzuki S-Presso e centenas de outros modelos — novos e usados, de particulares e concessionárias, com preços em kwanza (AOA).`,
      body: `O mercado automóvel de ${loc} é dos mais activos de Angola: pick-ups 4x4 para o trabalho e o interior, berlinas económicas para a cidade e SUVs familiares. Compare ofertas, filtre por marca, ano, quilometragem e combustível, e negocie directamente com o vendedor — sem intermediários.`,
      cta: `Tem um carro para vender? Publique gratuitamente em ${loc} com fotos e receba contactos de compradores no próprio dia!`,
    }),
    motorcycles: loc => ({
      intro: `Compre ou venda motos e scooters em ${loc} no Ambo Market. Bajaj Boxer, Haojue, Haojin, TVS, Honda e Yamaha — das motos de trabalho às desportivas, novas e usadas, com preços em kwanza (AOA).`,
      body: `A moto é o motor da mobilidade em Angola: mais de um milhão de kupapatas circulam no país, metade em Luanda. Em ${loc}, encontre motos económicas para trabalho, scooters para a cidade e trail para o mato — com peças baratas e mecânicos em qualquer bairro.`,
      cta: `Venda a sua moto gratuitamente em ${loc} — motos de trabalho encontram comprador em poucos dias!`,
    }),
    commercial: loc => ({
      intro: `Encontre veículos comerciais em ${loc} no Ambo Market. Camiões, carrinhas de carga, autocarros, Hiace, Sprinter e tractores — para transporte, comércio e construção, novos e usados, em kwanza (AOA).`,
      body: `O transporte de carga e passageiros move a economia de ${loc}: camiões para obra e mineração, Hiace para o táxi colectivo, furgões para entregas. Compre directamente de empresas e particulares, sem comissões — verifique documentação e estado mecânico antes de fechar negócio.`,
      cta: `Anuncie o seu camião ou carrinha gratuitamente em ${loc} — empresas procuram viaturas de trabalho todos os dias!`,
    }),
    boats: loc => ({
      intro: `Compre ou venda barcos em ${loc} no Ambo Market. Barcos de pesca, lanchas, botes com motor de popa e jet skis — para trabalho e lazer na costa angolana, novos e usados, em kwanza (AOA).`,
      body: `Com mais de 1.600 km de costa, Angola vive do mar: barcos de pesca artesanal para o sustento, lanchas para lazer na Ilha de Luanda e no Mussulo, motores de popa e equipamento marítimo. Em ${loc}, negocie directamente com o dono e verifique casco e motor antes de comprar.`,
      cta: `Venda o seu barco ou motor gratuitamente em ${loc} no Ambo Market!`,
    }),
    parts: loc => ({
      intro: `Encontre peças e acessórios auto em ${loc} no Ambo Market. Pneus, jantes, baterias, motores, caixas de velocidade, faróis e peças de carroçaria — novas e usadas, para todas as marcas, em kwanza (AOA).`,
      body: `Manter o carro a andar em Angola exige peças acessíveis: em ${loc} encontrará peças originais e compatíveis para Toyota, Hyundai, Nissan e outras marcas — de motores completos a retrovisores. Compare preços de vendedores locais e poupe face à importação.`,
      cta: `Venda peças e acessórios gratuitamente em ${loc} — mecânicos e condutores procuram todos os dias!`,
    }),
  },
  electronics: {
    phones: loc => ({
      intro: `Compre ou venda telemóveis em ${loc} no Ambo Market. iPhone, Samsung Galaxy, Tecno, itel, Infinix e Xiaomi — novos e usados, com fotos reais e preços em kwanza (AOA).`,
      body: `O telemóvel é o artigo mais negociado dos classificados de ${loc}: iPhone e Samsung mantêm valor, enquanto Tecno, itel e Infinix dominam o mercado acessível. Ao comprar usado, verifique o IMEI, o estado da bateria e o desbloqueio da conta antes de pagar.`,
      cta: `Venda o seu telemóvel gratuitamente em ${loc} — publique com fotos e venda em poucos dias!`,
    }),
    computers: loc => ({
      intro: `Compre ou venda computadores e portáteis em ${loc} no Ambo Market. Lenovo ThinkPad, HP, Dell, MacBook e PCs gaming — novos e usados, para estudo, trabalho e jogos, em kwanza (AOA).`,
      body: `Em ${loc}, o portátil certo não precisa de custar uma fortuna: os ThinkPad e EliteBook ex-empresa são compras seguras a preço reduzido, os MacBook mantêm valor e os PCs gaming chegam por muito menos que novos. Teste o equipamento e verifique bateria e ecrã antes de comprar.`,
      cta: `Venda o seu portátil gratuitamente em ${loc} — estudantes e profissionais procuram todos os dias!`,
    }),
    gaming: loc => ({
      intro: `Compre ou venda consolas e jogos em ${loc} no Ambo Market. PlayStation 5, PS4, Xbox Series, Nintendo Switch, comandos e jogos — novos e usados, com preços em kwanza (AOA).`,
      body: `O gaming cresce em Angola: a PS5 é a consola mais desejada, a PS4 usada continua imbatível em custo-benefício e a Switch conquista as famílias. Em ${loc}, encontre consolas, comandos extra e jogos físicos — teste tudo antes de pagar.`,
      cta: `Venda a sua consola ou jogos gratuitamente em ${loc} — vendem-se em dias no Ambo Market!`,
    }),
    'tv-audio-photo': loc => ({
      intro: `Encontre TVs, áudio e fotografia em ${loc} no Ambo Market. Televisores LED e Smart TV, colunas, amplificadores, home cinema, câmaras Canon e Nikon — novos e usados, em kwanza (AOA).`,
      body: `Equipe a sala e o estúdio sem gastar muito: em ${loc} há Smart TVs de todos os tamanhos, sistemas de som para casa e eventos, e câmaras para quem fotografa a sério. Compre de vendedores locais, teste no acto e negocie o preço directamente.`,
      cta: `Venda a sua TV, coluna ou câmara gratuitamente em ${loc} no Ambo Market!`,
    }),
    appliances: loc => ({
      intro: `Compre ou venda electrodomésticos em ${loc} no Ambo Market. Frigoríficos, arcas, máquinas de lavar, fogões, micro-ondas e ar condicionado — novos e usados, com preços em kwanza (AOA).`,
      body: `Montar casa em ${loc} fica mais barato no Ambo Market: frigoríficos e arcas em bom estado, máquinas de lavar com garantia do vendedor, fogões a gás e splits de ar condicionado prontos a instalar. Verifique o funcionamento antes de comprar e poupe face ao preço de loja.`,
      cta: `Venda os seus electrodomésticos gratuitamente em ${loc} — quem muda de casa procura todos os dias!`,
    }),
    'accessories-electronics': loc => ({
      intro: `Encontre acessórios electrónicos em ${loc} no Ambo Market. Carregadores, powerbanks, capas, auscultadores, smartwatches, routers e cabos — novos e usados, a preços acessíveis em kwanza (AOA).`,
      body: `Os acessórios certos prolongam a vida dos seus aparelhos: em ${loc} encontrará carregadores originais, powerbanks para os cortes de energia, auscultadores bluetooth e routers para internet em casa. Pequenos preços, entrega fácil, negócio directo.`,
      cta: `Venda acessórios gratuitamente em ${loc} — artigos baratos vendem-se depressa no Ambo Market!`,
    }),
  },
  services: {
    construction: loc => ({
      intro: `Encontre profissionais de construção e reforma em ${loc} no Ambo Market. Pedreiros, electricistas, canalizadores, pintores, carpinteiros e empreiteiros — orçamentos directos, sem intermediários.`,
      body: `Construir ou renovar em ${loc} começa por encontrar quem sabe: equipas para obra completa, electricistas certificados, canalizadores para urgências e pintores que cumprem prazos. Compare orçamentos, veja trabalhos anteriores e contrate directamente.`,
      cta: `É profissional de construção? Anuncie os seus serviços gratuitamente em ${loc} e receba pedidos de orçamento!`,
    }),
    'it-dev': loc => ({
      intro: `Encontre serviços de TI e desenvolvimento em ${loc} no Ambo Market. Criação de sites, aplicações, reparação de computadores, redes, design gráfico e marketing digital — profissionais locais a preços justos.`,
      body: `A economia digital cresce em Angola: em ${loc} há programadores para o site do seu negócio, técnicos que recuperam computadores e dados, e designers para a sua marca. Contrate localmente, pague em kwanza e acompanhe o trabalho de perto.`,
      cta: `Trabalha com tecnologia? Publique os seus serviços gratuitamente em ${loc} e encontre clientes no Ambo Market!`,
    }),
    education: loc => ({
      intro: `Encontre serviços de educação em ${loc} no Ambo Market. Explicações de matemática, física e português, aulas de inglês, informática, condução e preparação para exames — professores particulares e centros de estudo.`,
      body: `Investir nos estudos abre portas: em ${loc}, professores particulares dão explicações ao domicílio ou online, centros preparam para exames de acesso e cursos de inglês e informática valorizam qualquer currículo. Compare preços e escolha o professor certo.`,
      cta: `É professor ou formador? Anuncie as suas aulas gratuitamente em ${loc} e encontre alunos no Ambo Market!`,
    }),
    beauty: loc => ({
      intro: `Encontre serviços de beleza e saúde em ${loc} no Ambo Market. Cabeleireiros, tranças, barbearias, manicure, maquilhagem para eventos e massagens — profissionais ao domicílio e em salão.`,
      body: `Do penteado para o casamento às tranças da semana: em ${loc} há cabeleireiras que atendem em casa, barbearias de bairro, especialistas em unhas de gel e maquilhadoras para eventos. Veja fotos de trabalhos, compare preços e marque directamente.`,
      cta: `Trabalha na área da beleza? Publique os seus serviços gratuitamente em ${loc} e ganhe novos clientes!`,
    }),
    'other-services': loc => ({
      intro: `Encontre todo o tipo de serviços em ${loc} no Ambo Market. Limpeza, mudanças, transporte, jardinagem, segurança, fotografia de eventos e reparações — profissionais locais com preços directos.`,
      body: `O que precisar de resolver em ${loc}, há quem faça: empresas de limpeza, carrinhas para mudanças, fotógrafos de casamento, técnicos de electrodomésticos. Negocie o preço directamente com o prestador e combine no seu horário.`,
      cta: `Presta serviços? Anuncie gratuitamente em ${loc} e receba pedidos de clientes no Ambo Market!`,
    }),
  },
  'real-estate': {
    rent: loc => ({
      intro: `Encontre casas e apartamentos para alugar em ${loc} no Ambo Market. T1, T2 e T3, moradias, vivendas e anexos — arrendamento directo com proprietários, preços em kwanza (AOA).`,
      body: `Alugar casa em ${loc} sem intermediários poupa tempo e dinheiro: apartamentos em condomínios com água e luz, anexos acessíveis nos bairros e vivendas para famílias. Fale directamente com o proprietário, visite o imóvel e negocie caução e renda.`,
      cta: `Tem casa para arrendar? Publique gratuitamente em ${loc} — inquilinos procuram todos os dias no Ambo Market!`,
    }),
    sale: loc => ({
      intro: `Encontre casas e apartamentos à venda em ${loc} no Ambo Market. Apartamentos T2 e T3, moradias, vivendas em condomínio e projectos — venda directa de proprietários, em kwanza (AOA) ou USD.`,
      body: `Comprar casa é a decisão de uma vida: em ${loc} há apartamentos no Kilamba e em Talatona, vivendas em condomínios fechados e casas nos bairros em crescimento. Verifique sempre a documentação do imóvel e negocie directamente com o proprietário.`,
      cta: `Vende a sua casa? Anuncie gratuitamente em ${loc} e alcance compradores de todo o país no Ambo Market!`,
    }),
    'commercial-property': loc => ({
      intro: `Encontre imóveis comerciais em ${loc} no Ambo Market. Lojas, escritórios, armazéns, espaços para restauração e terrenos comerciais — para arrendar ou comprar, com preços em kwanza (AOA).`,
      body: `O sítio certo faz o negócio: lojas de rua com movimento, escritórios em Talatona e na Baixa, armazéns perto do porto e espaços prontos para restauração. Em ${loc}, negocie directamente com proprietários e poupe nas comissões.`,
      cta: `Tem um espaço comercial? Publique gratuitamente em ${loc} — empresas procuram instalações todos os dias!`,
    }),
    land: loc => ({
      intro: `Encontre terrenos à venda em ${loc} no Ambo Market. Lotes urbanizados, terrenos para construção, quintas e fazendas — com documentação, venda directa de proprietários, em kwanza (AOA).`,
      body: `Comprar terreno é investir no futuro: lotes para construir casa própria, terrenos comerciais em zonas de expansão e fazendas para agricultura. Em ${loc}, confirme sempre a documentação (croqui, declaração da comissão de moradores, título) antes de qualquer pagamento.`,
      cta: `Vende um terreno? Anuncie gratuitamente em ${loc} com localização e documentação — compradores sérios esperam!`,
    }),
  },
  animals: {
    pets: loc => ({
      intro: `Compre, venda ou adopte cães e gatos em ${loc} no Ambo Market. Pastor Alemão, Labrador, Rottweiler, Boerboel, gatos domésticos e de raça — animais saudáveis de criadores e particulares.`,
      body: `Um bom cão vale ouro em ${loc}: raças de guarda como o Boerboel e o Rottweiler protegem a casa, o Labrador é o companheiro da família e os gatos resolvem o resto. Peça a caderneta de vacinas, veja os pais da ninhada e escolha um criador de confiança.`,
      cta: `Tem uma ninhada? Anuncie gratuitamente em ${loc} com fotos — cães de raça encontram dono em dias!`,
    }),
    'other-animals': loc => ({
      intro: `Compre ou venda animais em ${loc} no Ambo Market. Gado bovino, cabras, ovelhas, porcos, galinhas, patos e aves ornamentais — animais de criação e capoeira, de produtores locais.`,
      body: `A criação de animais sustenta famílias em toda Angola: gado para carne e leite, cabritos para a festa, galinhas poedeiras para o negócio dos ovos. Em ${loc}, compre directamente ao criador, veja os animais no local e negocie por cabeça ou por lote.`,
      cta: `É criador? Venda os seus animais gratuitamente em ${loc} no Ambo Market!`,
    }),
    supplies: loc => ({
      intro: `Encontre rações e acessórios para animais em ${loc} no Ambo Market. Ração para cão, gato e aves, trelas, casotas, gaiolas, aquários e produtos veterinários — a preços acessíveis em kwanza (AOA).`,
      body: `Animal bem tratado é animal saudável: em ${loc} encontrará ração de qualidade a preço de grosso, casotas e gaiolas, e acessórios que nas lojas custam o dobro. Compare ofertas e combine a entrega com o vendedor.`,
      cta: `Vende rações ou acessórios? Publique gratuitamente em ${loc} — donos de animais compram todas as semanas!`,
    }),
  },
  fashion: {
    men: loc => ({
      intro: `Encontre moda masculina em ${loc} no Ambo Market. Camisas, calças, fatos, t-shirts e roupa desportiva — marcas originais e roupa em segunda mão em bom estado, a preços justos em kwanza (AOA).`,
      body: `Vestir bem não precisa de custar caro: em ${loc} há fatos para o escritório e a igreja, roupa casual de marca e fardos seleccionados em óptimo estado. Compre directamente, experimente antes de pagar e renove o guarda-roupa por pouco.`,
      cta: `Venda a roupa que já não usa gratuitamente em ${loc} — moda masculina tem sempre procura!`,
    }),
    women: loc => ({
      intro: `Encontre moda feminina em ${loc} no Ambo Market. Vestidos, saias, blusas, capulanas e roupa de cerimónia — das marcas internacionais ao estilo angolano, novas e em segunda mão, em kwanza (AOA).`,
      body: `A moda em ${loc} mistura tendência e tradição: vestidos para eventos, conjuntos de capulana costurados à medida e roupa de marca a preços de segunda mão. Veja fotos reais, confirme medidas com a vendedora e negocie directamente.`,
      cta: `Venda as suas peças gratuitamente em ${loc} — moda feminina é das secções mais visitadas do Ambo Market!`,
    }),
    shoes: loc => ({
      intro: `Encontre calçado em ${loc} no Ambo Market. Sapatilhas Nike, Adidas e Jordan, sapatos clássicos, sandálias e botas — originais e em segunda mão, para homem, mulher e criança, em kwanza (AOA).`,
      body: `Do ténis do momento ao sapato do casamento: em ${loc} há sapatilhas originais a preço negociável, clássicos para o escritório e calçado infantil que dura mais que o pé. Confirme o tamanho e o estado das solas antes de fechar negócio.`,
      cta: `Venda o seu calçado gratuitamente em ${loc} — sapatilhas de marca vendem-se depressa!`,
    }),
    bags: loc => ({
      intro: `Encontre malas e bolsas em ${loc} no Ambo Market. Bolsas de senhora, mochilas, malas de viagem e pastas de trabalho — de marca e acessíveis, novas e usadas, em kwanza (AOA).`,
      body: `A mala certa completa o visual e aguenta a rotina: em ${loc} encontrará bolsas de marca a fracção do preço de loja, mochilas para a escola e malas de viagem robustas. Verifique fechos e costuras e negocie directamente com o vendedor.`,
      cta: `Venda as suas malas gratuitamente em ${loc} no Ambo Market!`,
    }),
    'accessories-fashion': loc => ({
      intro: `Encontre acessórios de moda em ${loc} no Ambo Market. Relógios, óculos de sol, bijutaria, cintos, bonés e jóias — originais e acessíveis, novos e usados, com preços em kwanza (AOA).`,
      body: `São os detalhes que fazem o estilo: relógios de marca, óculos de sol originais e bijutaria que valoriza qualquer visual. Em ${loc}, compre directamente a quem vende, compare preços e desconfie de «originais» demasiado baratos.`,
      cta: `Venda os seus acessórios gratuitamente em ${loc} — artigos pequenos, vendas rápidas!`,
    }),
    'beauty-products': loc => ({
      intro: `Encontre produtos de beleza em ${loc} no Ambo Market. Perfumes originais, cremes, maquilhagem, extensões e produtos capilares — das marcas internacionais às preferidas de Angola, em kwanza (AOA).`,
      body: `Beleza a preço justo: perfumes originais mais baratos que nas lojas, maquilhagem das marcas do momento e extensões de qualidade. Em ${loc}, confirme sempre que os produtos estão selados e dentro da validade antes de comprar.`,
      cta: `Vende cosméticos? Publique gratuitamente em ${loc} e alcance clientes todos os dias no Ambo Market!`,
    }),
  },
  home: {
    furniture: loc => ({
      intro: `Encontre móveis em ${loc} no Ambo Market. Sofás, camas, roupeiros, mesas de jantar, cadeiras e estantes — novos e usados em bom estado, com preços em kwanza (AOA).`,
      body: `Mobilar a casa em ${loc} fica muito mais barato em segunda mão: sofás quase novos de quem muda de casa, camas com colchão incluído e mesas de jantar completas. Veja as fotos com atenção, confirme medidas e combine o transporte com o vendedor.`,
      cta: `Vai mudar de casa? Venda os seus móveis gratuitamente em ${loc} — saem depressa no Ambo Market!`,
    }),
    tools: loc => ({
      intro: `Encontre ferramentas em ${loc} no Ambo Market. Berbequins, rebarbadoras, geradores, compressores, ferramenta manual e material de construção — novas e usadas, com preços em kwanza (AOA).`,
      body: `Ferramenta boa paga-se sozinha: geradores para os cortes de luz, berbequins e rebarbadoras para a obra, e caixas de ferramenta completas para o dia-a-dia. Em ${loc}, compre a profissionais que renovam equipamento e poupe no arranque do seu projecto.`,
      cta: `Venda as suas ferramentas gratuitamente em ${loc} — profissionais e biscateiros procuram sempre!`,
    }),
    decor: loc => ({
      intro: `Encontre artigos de decoração em ${loc} no Ambo Market. Candeeiros, tapetes, cortinas, quadros, espelhos e plantas — para dar vida à sua casa, novos e usados, em kwanza (AOA).`,
      body: `Uma casa com identidade faz-se de detalhes: candeeiros que mudam o ambiente, tapetes e cortinas a condizer, quadros e espelhos que ampliam a sala. Em ${loc}, renove a decoração por pouco dinheiro comprando directamente a outros particulares.`,
      cta: `Venda a sua decoração gratuitamente em ${loc} no Ambo Market!`,
    }),
    'other-home': loc => ({
      intro: `Encontre artigos para a casa em ${loc} no Ambo Market. Loiça, panelas, roupa de cama, arrumação, artigos de limpeza e tudo o que a casa precisa — novo e usado, a preços acessíveis em kwanza (AOA).`,
      body: `Do enxoval completo ao jogo de panelas: em ${loc} encontrará artigos de casa novos e pouco usados por fracção do preço de loja. Ideal para quem monta a primeira casa ou repõe o essencial sem gastar muito.`,
      cta: `Venda o que já não usa em casa gratuitamente em ${loc} — tudo encontra comprador no Ambo Market!`,
    }),
  },
  hobby: {
    sport: loc => ({
      intro: `Encontre artigos de desporto em ${loc} no Ambo Market. Bicicletas, equipamento de ginásio, pesos, passadeiras, bolas e material de futebol — novos e usados, com preços em kwanza (AOA).`,
      body: `Treinar não precisa de mensalidade: em ${loc} há pesos e bancos para o ginásio de casa, bicicletas para todos os tamanhos e equipamento de futebol para a equipa do bairro. Compre usado em bom estado e comece hoje.`,
      cta: `Venda o seu equipamento desportivo gratuitamente em ${loc} no Ambo Market!`,
    }),
    music: loc => ({
      intro: `Encontre instrumentos musicais em ${loc} no Ambo Market. Guitarras, teclados, baterias, djembes, colunas e mesas de mistura — para músicos, igrejas e eventos, novos e usados, em kwanza (AOA).`,
      body: `A música vive em cada esquina de Angola: guitarras e teclados para a banda da igreja, djembes e percussão tradicional, e equipamento de som para animar eventos. Em ${loc}, experimente o instrumento antes de comprar e negocie directamente.`,
      cta: `Venda o seu instrumento gratuitamente em ${loc} — músicos procuram equipamento todas as semanas!`,
    }),
    games: loc => ({
      intro: `Encontre livros e jogos em ${loc} no Ambo Market. Livros escolares e universitários, romances, jogos de tabuleiro, cartas e puzzles — novos e usados, a preços acessíveis em kwanza (AOA).`,
      body: `Ler e jogar sem gastar muito: manuais escolares em segunda mão que poupam no início do ano lectivo, romances e livros técnicos, e jogos de tabuleiro para a família. Em ${loc}, os livros usados custam uma fracção do preço das livrarias.`,
      cta: `Venda os seus livros e jogos gratuitamente em ${loc} — estudantes procuram manuais todo o ano!`,
    }),
    collectibles: loc => ({
      intro: `Encontre coleccionáveis e antiguidades em ${loc} no Ambo Market. Moedas, notas antigas, selos, arte, artesanato angolano e peças raras — de coleccionadores e particulares, em kwanza (AOA).`,
      body: `Cada peça conta uma história: moedas e notas do tempo colonial, arte e máscaras tradicionais, selos e relíquias que ganham valor com os anos. Em ${loc}, verifique a autenticidade e negocie directamente com o coleccionador.`,
      cta: `Tem peças raras? Anuncie gratuitamente em ${loc} — coleccionadores pagam bem por bons artigos!`,
    }),
    'other-hobby': loc => ({
      intro: `Encontre artigos de lazer em ${loc} no Ambo Market. Material de pesca, campismo, drones, jogos, artesanato e tudo para os seus passatempos — novo e usado, com preços em kwanza (AOA).`,
      body: `Tempo livre bem passado: canas e material de pesca para o fim-de-semana, tendas e equipamento de campismo, drones e gadgets para os curiosos. Em ${loc}, compre directamente a outros entusiastas e pague menos.`,
      cta: `Venda os artigos do seu passatempo gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  kids: {
    clothes: loc => ({
      intro: `Encontre roupa infantil em ${loc} no Ambo Market. Roupa de bebé e criança, uniformes escolares, calçado infantil e conjuntos completos — nova e usada em bom estado, a preços acessíveis em kwanza (AOA).`,
      body: `As crianças crescem depressa — o orçamento agradece a segunda mão: roupa de bebé quase nova, uniformes para o ano lectivo e calçado em todos os tamanhos. Em ${loc}, vista os miúdos por uma fracção do preço de loja.`,
      cta: `Venda a roupa que já não serve gratuitamente em ${loc} — mães e pais compram todas as semanas!`,
    }),
    toys: loc => ({
      intro: `Encontre brinquedos em ${loc} no Ambo Market. Bonecas, carrinhos, legos, bicicletas infantis, jogos educativos e peluches — novos e usados em bom estado, com preços em kwanza (AOA).`,
      body: `Alegria não tem de custar caro: brinquedos educativos para os mais pequenos, bicicletas e trotinetes para gastar energia, e legos que passam de irmão para irmão. Em ${loc}, verifique o estado e a segurança do brinquedo antes de comprar.`,
      cta: `Venda os brinquedos esquecidos gratuitamente em ${loc} — faça outra criança feliz e ganhe uns kwanzas!`,
    }),
    furniture: loc => ({
      intro: `Encontre móveis infantis em ${loc} no Ambo Market. Berços, camas de criança, cadeiras de papa, carrinhos de bebé, cadeiras auto e cómodas — novos e usados, com preços em kwanza (AOA).`,
      body: `O enxoval do bebé por metade do preço: berços completos com colchão, carrinhos práticos para a cidade e cadeiras auto que garantem viagens seguras. Em ${loc}, os móveis infantis usados estão quase sempre em óptimo estado — as crianças crescem antes de os gastar.`,
      cta: `O bebé cresceu? Venda o berço e o carrinho gratuitamente em ${loc} — futuras mamãs procuram todos os dias!`,
    }),
    'other-kids': loc => ({
      intro: `Encontre artigos infantis em ${loc} no Ambo Market. Material escolar, mochilas, biberões, banheiras de bebé, brinquedos didácticos e tudo para os mais pequenos — novo e usado, em kwanza (AOA).`,
      body: `Tudo o que os filhos precisam num só lugar: mochilas e material para a escola, artigos de bebé que se usam poucos meses e acessórios que facilitam a vida dos pais. Em ${loc}, poupe comprando directamente a outras famílias.`,
      cta: `Venda os artigos infantis parados gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  jobs: {
    vacancies: loc => ({
      intro: `Encontre vagas de emprego em ${loc} no Ambo Market. Ofertas em construção, comércio, transporte, escritório, saúde, educação e tecnologia — de empresas e particulares, actualizadas todos os dias.`,
      body: `O próximo emprego pode estar aqui: vagas para motoristas, vendedores, técnicos, seguranças, professores e profissionais qualificados em ${loc}. Candidate-se directamente ao empregador, sem intermediários — e desconfie de «vagas» que pedem dinheiro adiantado.`,
      cta: `Está a contratar? Publique a sua vaga gratuitamente em ${loc} e receba candidaturas no próprio dia!`,
    }),
    resumes: loc => ({
      intro: `Encontre profissionais disponíveis em ${loc} no Ambo Market. Currículos de motoristas, domésticas, técnicos, vendedores, seguranças e quadros qualificados — contacto directo com os candidatos.`,
      body: `Contratar bem é meio caminho andado: em ${loc}, profissionais de todas as áreas publicam o seu perfil e experiência à procura de oportunidade. Fale directamente com o candidato, peça referências e combine uma entrevista.`,
      cta: `Procura trabalho? Publique o seu currículo gratuitamente em ${loc} e deixe os empregadores encontrá-lo!`,
    }),
  },
};

export function getSubcategorySeoText(categoryId: string, subcategoryId: string, loc: string): SubcategorySeoText | undefined {
  return SUBCATEGORY_SEO_TEXTS[categoryId]?.[subcategoryId]?.(loc);
}
