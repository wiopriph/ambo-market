// SEO-тексты для страниц брендов (/[city]/[category]/[subcategory]/[brand]).
// Подменяют intro/body/cta общекатегорийного текста в SeoCategoryText.
// loc — название города или «Angola».

export type BrandSeoText = {
  intro: string;
  body: string;
  cta: string;
};

export const BRAND_SEO_TEXTS: Record<string, Record<string, (loc: string) => BrandSeoText>> = {
  cars: {
    toyota: loc => ({
      intro: `Compre ou venda carros Toyota em ${loc} no Ambo Market. Hilux, Land Cruiser, Corolla, RAV4, Fortuner, Prado e Yaris — novos e usados, de particulares e concessionárias, com fotos reais e preços em kwanza (AOA).`,
      body: `A Toyota é a marca mais procurada de Angola: peças fáceis de encontrar, mecânicos em qualquer província e valor de revenda imbatível. A Hilux domina o trabalho no terreno, o Land Cruiser é referência nas estradas difíceis e o Corolla continua o berlina mais fiável para a cidade. Filtre por ano, quilometragem e combustível para encontrar o seu Toyota em ${loc}.`,
      cta: `Tem um Toyota para vender? Publique gratuitamente em ${loc} — anúncios de Hilux e Land Cruiser recebem contactos no próprio dia!`,
    }),
    suzuki: loc => ({
      intro: `Encontre carros Suzuki em ${loc} no Ambo Market. Jimny, Swift, Vitara, S-Presso e Grand Vitara — compactos económicos e 4x4 ágeis, novos e usados, a preços acessíveis em kwanza (AOA).`,
      body: `A Suzuki conquistou Angola com carros pequenos, poupados e fáceis de manter. O Jimny é o 4x4 compacto ideal para estradas de terra, o Swift brilha no trânsito urbano e o S-Presso é das entradas mais baratas para carro novo. Consumo baixo e manutenção simples fazem dos Suzuki uma escolha inteligente em ${loc}.`,
      cta: `Venda o seu Suzuki gratuitamente em ${loc} — publique com fotos e receba propostas de compradores directos!`,
    }),
    hyundai: loc => ({
      intro: `Compre ou venda carros Hyundai em ${loc} no Ambo Market. Tucson, Santa Fe, Creta, i10, Accent e Elantra — SUVs modernos e citadinos económicos, novos e usados, com preços em kwanza (AOA).`,
      body: `A Hyundai combina design moderno, equipamento completo e preço competitivo. O Tucson é dos SUVs mais vendidos em ${loc}, o Creta cresce entre as famílias e o i10 é perfeito para a cidade. Garantias longas e consumo contido tornam os Hyundai usados uma compra segura no mercado angolano.`,
      cta: `Anuncie o seu Hyundai gratuitamente em ${loc} e chegue a compradores de todo o país no Ambo Market!`,
    }),
    kia: loc => ({
      intro: `Encontre carros Kia em ${loc} no Ambo Market. Sportage, Sorento, Picanto, Rio e Seltos — do citadino ao SUV familiar, novos e usados, com fotos reais e preços negociáveis em kwanza (AOA).`,
      body: `A Kia é sinónimo de bom equipamento pelo preço justo. O Sportage é dos SUVs mais procurados em ${loc}, o Picanto lidera entre os citadinos económicos e o Sorento serve famílias grandes com conforto. Design premiado e fiabilidade coreana explicam por que os Kia mantêm bom valor de revenda em Angola.`,
      cta: `Venda o seu Kia sem comissões em ${loc} — publique o anúncio gratuitamente e negocie directamente!`,
    }),
    mitsubishi: loc => ({
      intro: `Compre ou venda Mitsubishi em ${loc} no Ambo Market. L200, Pajero, Outlander, ASX e Montero Sport — pick-ups e 4x4 robustos para o terreno angolano, novos e usados, em kwanza (AOA).`,
      body: `A Mitsubishi construiu a sua fama em Angola nas estradas difíceis: a L200 é uma das pick-ups mais duras do mercado e o Pajero atravessa qualquer província. São carros pensados para trabalho, agricultura e mineração, com tracção 4x4 de verdade e mecânica que aguenta anos. Em ${loc}, encontre o seu Mitsubishi verificado com fotos reais.`,
      cta: `Publique a sua L200 ou Pajero gratuitamente em ${loc} — compradores de 4x4 procuram todos os dias no Ambo Market!`,
    }),
    chevrolet: loc => ({
      intro: `Encontre carros Chevrolet em ${loc} no Ambo Market. Spark, Aveo, Cruze, Captiva e Trailblazer — americanos acessíveis e espaçosos, novos e usados, com preços em kwanza (AOA).`,
      body: `A Chevrolet oferece carros práticos a preços de entrada atractivos. O Spark é dos usados mais baratos para começar a conduzir, o Cruze dá conforto de berlina médio e o Trailblazer leva sete lugares para fora da cidade. Em ${loc}, os Chevrolet usados destacam-se pela relação espaço-preço.`,
      cta: `Venda o seu Chevrolet gratuitamente em ${loc} — anúncio com fotos vende mais depressa no Ambo Market!`,
    }),
    nissan: loc => ({
      intro: `Compre ou venda Nissan em ${loc} no Ambo Market. Navara, Patrol, X-Trail, Qashqai, Almera e Hardbody — pick-ups de trabalho e SUVs familiares, novos e usados, em kwanza (AOA).`,
      body: `A Nissan é presença histórica nas estradas angolanas: a Navara e a velha Hardbody são cavalos de trabalho incansáveis, o Patrol enfrenta o mato como poucos e o Qashqai virou favorito urbano. Peças acessíveis e mecânica conhecida pelos mecânicos locais fazem dos Nissan usados uma aposta segura em ${loc}.`,
      cta: `Anuncie o seu Nissan gratuitamente em ${loc} e receba contactos directos de compradores interessados!`,
    }),
    renault: loc => ({
      intro: `Encontre carros Renault em ${loc} no Ambo Market. Duster, Logan, Sandero, Kwid e Clio — franceses económicos e práticos, novos e usados, a preços acessíveis em kwanza (AOA).`,
      body: `A Renault aposta em carros simples e baratos de manter. O Duster é o SUV de melhor custo-benefício para estradas irregulares, o Logan oferece mala enorme pelo preço de um citadino e o Kwid é porta de entrada para carro novo. Em ${loc}, os Renault atraem quem quer gastar pouco sem abrir mão de espaço.`,
      cta: `Venda o seu Renault sem comissões em ${loc} — publique gratuitamente no Ambo Market!`,
    }),
    ford: loc => ({
      intro: `Compre ou venda Ford em ${loc} no Ambo Market. Ranger, Everest, EcoSport, Focus e F-150 — pick-ups potentes e SUVs versáteis, novos e usados, com preços em kwanza (AOA).`,
      body: `A Ford Ranger é rival directa da Hilux no trabalho pesado: motores diesel fortes, cabine dupla confortável e 4x4 competente. O Everest leva a família ao interior com segurança e o EcoSport resolve a cidade. Em ${loc}, os Ford usados são procurados por empresas de construção, agricultura e logística.`,
      cta: `Publique a sua Ranger ou outro Ford gratuitamente em ${loc} — o mercado de pick-ups está sempre activo!`,
    }),
    mercedes: loc => ({
      intro: `Encontre Mercedes-Benz em ${loc} no Ambo Market. Classe C, Classe E, GLE, GLC, Classe G e Sprinter — luxo alemão novo e usado, com fotos reais e preços em kwanza (AOA).`,
      body: `A Mercedes-Benz é o símbolo de estatuto nas ruas de ${loc}: o Classe C e o Classe E dominam o segmento executivo, o GLE une luxo e altura ao solo, e o lendário Classe G não tem rival em presença. Para negócio, a Sprinter é referência no transporte. Compre com histórico verificado e negocie directamente com o vendedor.`,
      cta: `Venda o seu Mercedes-Benz gratuitamente em ${loc} — compradores premium procuram no Ambo Market todos os dias!`,
    }),
    volkswagen: loc => ({
      intro: `Compre ou venda Volkswagen em ${loc} no Ambo Market. Golf, Polo, Tiguan, Passat, Amarok e Touareg — engenharia alemã acessível, novos e usados, com preços em kwanza (AOA).`,
      body: `A Volkswagen equilibra qualidade alemã e preço razoável. O Golf é referência mundial entre os compactos, o Polo é robusto e económico para ${loc}, o Tiguan serve a família e a Amarok compete no trabalho pesado. Acabamento sólido e boa reputação mantêm os VW usados sempre procurados em Angola.`,
      cta: `Anuncie o seu Volkswagen gratuitamente em ${loc} e venda sem intermediários no Ambo Market!`,
    }),
    bmw: loc => ({
      intro: `Encontre BMW em ${loc} no Ambo Market. Série 3, Série 5, X5, X3, X6 e M — desportivos e SUVs premium, novos e usados, com fotos reais e preços em kwanza (AOA).`,
      body: `A BMW é a escolha de quem gosta de conduzir: o Série 3 é o executivo mais desportivo do segmento, o X5 combina luxo e capacidade fora da cidade e o X6 impõe presença em ${loc}. Motores potentes e interior tecnológico fazem dos BMW usados dos anúncios mais visitados do Ambo Market.`,
      cta: `Venda o seu BMW gratuitamente em ${loc} — publique com boas fotos e receba propostas rapidamente!`,
    }),
    jetour: loc => ({
      intro: `Compre ou venda Jetour em ${loc} no Ambo Market. Dashing, X70, X90 e T2 — SUVs chineses modernos com garantia e equipamento completo, novos e usados, em kwanza (AOA).`,
      body: `A Jetour cresce depressa em Angola: SUVs espaçosos, ecrãs grandes, câmaras 360 e preço bem abaixo dos rivais europeus. O X70 leva sete lugares, o Dashing atrai pelo design e o T2 aventura-se fora do asfalto. Em ${loc}, os Jetour novos e seminovos são alternativa séria para famílias que querem equipamento máximo pelo menor preço.`,
      cta: `Anuncie o seu Jetour gratuitamente em ${loc} — o interesse por SUVs chineses não pára de crescer!`,
    }),
    maxus: loc => ({
      intro: `Compre ou venda Maxus em ${loc} no Ambo Market. Pick-ups T60, T70 e T90, SUVs D60 e D90 e furgões de carga — veículos de trabalho robustos, novos e usados, com preços em kwanza (AOA).`,
      body: `A Maxus (grupo SAIC) especializa-se em veículos para trabalho duro: as pick-ups T60 e T70 trazem diesel turbo, tracção 4x4 e cabine dupla prontas para agricultura, mineração e construção, enquanto o D90 leva sete lugares para qualquer província. Preço competitivo face às pick-ups japonesas faz da Maxus uma das marcas que mais cresce em ${loc}.`,
      cta: `Publique a sua Maxus gratuitamente em ${loc} — empresas e trabalhadores procuram pick-ups todos os dias no Ambo Market!`,
    }),
    honda: loc => ({
      intro: `Compre ou venda carros Honda em ${loc} no Ambo Market. Civic, CR-V, Fit, Accord e HR-V — fiabilidade japonesa comprovada, novos e usados, com fotos reais e preços em kwanza (AOA).`,
      body: `A Honda é sinónimo de motor que não avaria: o Civic é dos usados mais equilibrados entre desempenho e consumo, o Fit surpreende pelo espaço em formato compacto e o CR-V serve a família com conforto e economia. Em ${loc}, os Honda importados mantêm-se anos sem dar problemas — verifique o histórico e negocie directamente com o vendedor.`,
      cta: `Venda o seu Honda gratuitamente em ${loc} — fiabilidade japonesa encontra comprador depressa no Ambo Market!`,
    }),
    gac: loc => ({
      intro: `Compre ou venda GAC em ${loc} no Ambo Market. GS3, GS4, GS8 e Empow — os SUVs chineses que entraram no top de vendas de Angola, novos e usados, com preços em kwanza (AOA).`,
      body: `A GAC Motor é o fenómeno do mercado angolano: o GS4 e o GS3 estão entre os carros mais vendidos do país, com design moderno, equipamento completo e garantia de fábrica. O GS8 leva sete lugares com acabamento premium por preço de SUV médio europeu. Em ${loc}, os GAC seminovos já aparecem no mercado de usados com óptimo custo-benefício.`,
      cta: `Anuncie o seu GAC gratuitamente em ${loc} — a procura pelos SUVs mais vendidos de Angola não pára!`,
    }),
    chery: loc => ({
      intro: `Encontre carros Chery em ${loc} no Ambo Market. Tiggo 4 Pro, Tiggo 7 Pro, Tiggo 8 e Arrizo — SUVs modernos com importador oficial em Angola, novos e usados, em kwanza (AOA).`,
      body: `A Chery é das marcas chinesas mais estabelecidas em Angola, com representação oficial e assistência no país. A linha Tiggo oferece SUVs bem equipados — ecrã grande, câmaras, sensores — por preço bem abaixo dos rivais japoneses e europeus. Em ${loc}, o Tiggo 4 Pro é aposta frequente de quem compra o primeiro SUV novo.`,
      cta: `Venda o seu Chery gratuitamente em ${loc} no Ambo Market — SUVs acessíveis têm procura constante!`,
    }),
    jac: loc => ({
      intro: `Compre ou venda JAC em ${loc} no Ambo Market. Pick-ups T6 e T8, SUVs JS4 e camiões ligeiros — veículos de trabalho chineses a preço acessível, novos e usados, em kwanza (AOA).`,
      body: `A JAC Motors aposta no trabalho: as pick-ups T6 e T8 custam menos que as rivais japonesas e aguentam carga e estrada de terra, enquanto os camiões ligeiros JAC são comuns no comércio e nas entregas em ${loc}. Para pequenos negócios, agricultura e construção, a JAC é das formas mais baratas de pôr um veículo de carga a trabalhar.`,
      cta: `Anuncie o seu JAC gratuitamente em ${loc} — empresas procuram veículos de trabalho todos os dias!`,
    }),
    changan: loc => ({
      intro: `Encontre carros Changan em ${loc} no Ambo Market. CS35 Plus, CS55 Plus, Alsvin e pick-up Hunter — design moderno e preço justo, novos e usados, com preços em kwanza (AOA).`,
      body: `A Changan é uma das maiores fabricantes da China e cresce em Angola com SUVs bem construídos: o CS35 Plus é compacto e económico para ${loc}, o CS55 Plus dá espaço familiar com visual arrojado e o Alsvin é das berlinas novas mais baratas do mercado. Equipamento generoso de série e consumo contido.`,
      cta: `Venda o seu Changan gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  motorcycles: {
    honda: loc => ({
      intro: `Compre ou venda motos Honda em ${loc} no Ambo Market. CG 125, CB, XR, CRF, PCX e Africa Twin — as motos mais vendidas de Angola, novas e usadas, com preços em kwanza (AOA).`,
      body: `A Honda domina as duas rodas em Angola: a CG 125 é a moto de trabalho por excelência — táxi-moto, entregas e deslocações diárias — enquanto a XR e a CRF enfrentam as estradas de terra e a PCX resolve a cidade com conforto. Motor que nunca deixa ficar mal e peças em qualquer esquina de ${loc}.`,
      cta: `Venda a sua Honda gratuitamente em ${loc} — motos económicas encontram comprador em poucos dias!`,
    }),
    yamaha: loc => ({
      intro: `Encontre motos Yamaha em ${loc} no Ambo Market. YBR 125, Crypton, XTZ, MT, NMAX e Ténéré — do trabalho diário à aventura, novas e usadas, em kwanza (AOA).`,
      body: `A Yamaha é rival directa da Honda nas ruas de ${loc}: a YBR 125 é robusta e poupada para o dia-a-dia, a XTZ aguenta terra e asfalto, e a série MT traz desportivas acessíveis. Mecânica simples, consumo baixo e revenda fácil fazem das Yamaha usadas das mais procuradas do Ambo Market.`,
      cta: `Anuncie a sua Yamaha gratuitamente em ${loc} e receba contactos directos no Ambo Market!`,
    }),
    suzuki: loc => ({
      intro: `Compre ou venda motos Suzuki em ${loc} no Ambo Market. GN 125, GSX, DR, V-Strom e Burgman — motos fiáveis para trabalho e estrada, novas e usadas, em kwanza (AOA).`,
      body: `A Suzuki oferece motos duras e baratas de manter: a GN 125 é clássico de trabalho em ${loc}, a DR domina o todo-o-terreno e a V-Strom leva mais longe quem viaja entre províncias. Boa relação preço-qualidade nas novas e usadas.`,
      cta: `Venda a sua Suzuki gratuitamente em ${loc} — publique com fotos e venda depressa!`,
    }),
    kawasaki: loc => ({
      intro: `Encontre motos Kawasaki em ${loc} no Ambo Market. Ninja, Z, KLX, Versys e ER-6 — desportivas e trail japonesas, novas e usadas, com preços em kwanza (AOA).`,
      body: `A Kawasaki é sinónimo de desempenho: as Ninja dominam o asfalto, as Z trazem agressividade urbana e a KLX enfrenta as picadas de ${loc}. Para quem quer subir de cilindrada, as Kawasaki usadas oferecem muita moto pelo preço.`,
      cta: `Anuncie a sua Kawasaki gratuitamente em ${loc} no Ambo Market!`,
    }),
    vespa: loc => ({
      intro: `Compre ou venda Vespa em ${loc} no Ambo Market. Primavera, Sprint, GTS e clássicas — scooters italianas com estilo intemporal, novas e usadas, em kwanza (AOA).`,
      body: `A Vespa é mais do que uma scooter — é um ícone. Ágil no trânsito de ${loc}, económica no consumo e com design que não envelhece, atrai tanto quem procura mobilidade diária como coleccionadores de clássicas restauradas.`,
      cta: `Venda a sua Vespa gratuitamente em ${loc} — há sempre apaixonados à procura no Ambo Market!`,
    }),
    ducati: loc => ({
      intro: `Encontre motos Ducati em ${loc} no Ambo Market. Monster, Panigale, Multistrada, Scrambler e Diavel — performance italiana, novas e usadas, com preços em kwanza (AOA).`,
      body: `A Ducati é o topo do desejo em duas rodas: a Panigale é pura pista, a Monster define a naked desportiva e a Multistrada cruza Angola com conforto e potência. Em ${loc}, as Ducati usadas são raras e valorizadas — quando aparecem, vendem depressa.`,
      cta: `Anuncie a sua Ducati gratuitamente em ${loc} e encontre um comprador à altura!`,
    }),
    'bmw-motorrad': loc => ({
      intro: `Compre ou venda BMW Motorrad em ${loc} no Ambo Market. R 1250 GS, F 850 GS, S 1000 RR, G 310 e C 400 — tecnologia alemã em duas rodas, novas e usadas, em kwanza (AOA).`,
      body: `A BMW Motorrad lidera nas grandes viagens: a R 1250 GS é a rainha do trail mundial e atravessa as estradas angolanas com electrónica de topo, ABS e modos de condução. Em ${loc}, as GS usadas são das motos premium mais procuradas para quem viaja entre províncias.`,
      cta: `Venda a sua BMW Motorrad gratuitamente em ${loc} no Ambo Market!`,
    }),
    'harley-davidson': loc => ({
      intro: `Encontre Harley-Davidson em ${loc} no Ambo Market. Sportster, Softail, Road King, Street Glide e Fat Boy — clássicos americanos, novos e usados, com preços em kwanza (AOA).`,
      body: `A Harley-Davidson é estilo de vida: motor V2 inconfundível, cromados e estrada aberta. Em ${loc}, as Harley usadas atraem entusiastas que procuram presença e som únicos — cada modelo tem a sua legião de fãs.`,
      cta: `Anuncie a sua Harley-Davidson gratuitamente em ${loc} — os apaixonados estão no Ambo Market!`,
    }),
    aprilia: loc => ({
      intro: `Compre ou venda Aprilia em ${loc} no Ambo Market. RSV4, Tuono, Tuareg 660, SR GT e RS 125 — desportivas e trail italianas, novas e usadas, em kwanza (AOA).`,
      body: `A Aprilia traz ADN de competição: a RSV4 é máquina de pista, a Tuono domina entre as naked potentes e a Tuareg 660 é das trail médias mais capazes para o terreno de ${loc}. Design arrojado e electrónica de topo.`,
      cta: `Venda a sua Aprilia gratuitamente em ${loc} no Ambo Market!`,
    }),
    bajaj: loc => ({
      intro: `Compre ou venda motos Bajaj em ${loc} no Ambo Market. Boxer 100, CT 100, Pulsar e Platina — a moto de trabalho número 1 de Angola, nova e usada, com preços em kwanza (AOA).`,
      body: `A Bajaj domina as ruas de Angola: a Boxer é a moto preferida dos kupapatas — barata, quase indestrutível e com consumo mínimo — e há peças e mecânicos em qualquer bairro de ${loc}. A CT 100 segue a mesma receita e a Pulsar acrescenta desempenho para quem quer mais. Comprar uma Bajaj usada é das formas mais rápidas de começar a trabalhar em duas rodas.`,
      cta: `Venda a sua Bajaj gratuitamente em ${loc} — é a moto mais procurada do Ambo Market!`,
    }),
    haojue: loc => ({
      intro: `Encontre motos Haojue em ${loc} no Ambo Market. HJ125, NK150, DK150 e mais — das motos mais vendidas de Angola, novas e usadas, com preços em kwanza (AOA).`,
      body: `A Haojue (parceira da Suzuki na China) é um dos três gigantes do mercado angolano de motos: máquinas simples, económicas e feitas para aguentar o trabalho diário. Em ${loc}, as HJ125 e NK150 são escolha constante de kupapatas e estafetas — peças baratas e qualquer mecânico as conhece.`,
      cta: `Anuncie a sua Haojue gratuitamente em ${loc} — motos de trabalho vendem-se em dias!`,
    }),
    haojin: loc => ({
      intro: `Compre ou venda motos Haojin em ${loc} no Ambo Market. HJ125, HJ150 e outros modelos de trabalho — económicas e fáceis de manter, novas e usadas, em kwanza (AOA).`,
      body: `A Haojin está entre as marcas mais vendidas de Angola pela razão mais simples: preço baixo e robustez. As HJ125 e HJ150 fazem centenas de quilómetros por semana nas mãos dos kupapatas de ${loc} e continuam a andar. Manutenção barata e peças em todo o lado.`,
      cta: `Venda a sua Haojin gratuitamente em ${loc} no Ambo Market!`,
    }),
    tvs: loc => ({
      intro: `Encontre motos TVS em ${loc} no Ambo Market. HLX 125, Star City e Apache — motos indianas económicas e fiáveis, novas e usadas, com preços em kwanza (AOA).`,
      body: `A TVS é das marcas que mais crescem em África: a HLX 125 foi desenhada para as estradas africanas — suspensão reforçada, consumo baixo e carga generosa — e a Apache traz estilo desportivo acessível. Em ${loc}, as TVS ganham terreno entre kupapatas e uso particular.`,
      cta: `Anuncie a sua TVS gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  phones: {
    apple: loc => ({
      intro: `Compre ou venda iPhone em ${loc} no Ambo Market. iPhone 15, 14, 13, 12 e 11 — Pro, Pro Max e modelos standard, novos e usados, com fotos reais e preços em kwanza (AOA).`,
      body: `O iPhone é o telemóvel mais desejado de Angola e mantém valor como nenhum outro: um iPhone usado em bom estado vende-se em dias. Em ${loc}, encontre desde o iPhone 11 acessível ao 15 Pro Max topo de gama — verifique sempre o estado da bateria, o IMEI e o desbloqueio do iCloud antes de pagar.`,
      cta: `Venda o seu iPhone gratuitamente em ${loc} — é dos artigos mais procurados do Ambo Market!`,
    }),
    samsung: loc => ({
      intro: `Encontre telemóveis Samsung em ${loc} no Ambo Market. Galaxy S24, S23, A55, A15, Note e Z Fold — do económico ao dobrável, novos e usados, com preços em kwanza (AOA).`,
      body: `A Samsung tem um Galaxy para cada bolso: a série A domina as vendas em ${loc} pelo equilíbrio preço-qualidade, a série S compete com o iPhone no topo e os dobráveis Z impressionam. Ecrãs AMOLED, boas câmaras e assistência fácil em Angola.`,
      cta: `Anuncie o seu Samsung gratuitamente em ${loc} e venda rapidamente no Ambo Market!`,
    }),
    itel: loc => ({
      intro: `Compre ou venda telemóveis itel em ${loc} no Ambo Market. A70, P55, S23 e teclados clássicos — os telemóveis mais acessíveis de Angola, novos e usados, em kwanza (AOA).`,
      body: `A itel é a porta de entrada para o smartphone em Angola: preços imbatíveis, baterias grandes que aguentam dias e dois cartões SIM. Em ${loc}, os itel novos custam menos que muitos usados de outras marcas — ideais para primeiro telemóvel ou linha de trabalho.`,
      cta: `Venda o seu itel gratuitamente em ${loc} — telemóveis económicos têm sempre procura!`,
    }),
    tecno: loc => ({
      intro: `Encontre telemóveis Tecno em ${loc} no Ambo Market. Spark, Camon, Pova e Phantom — câmaras fortes e baterias grandes a preços acessíveis, novos e usados, em kwanza (AOA).`,
      body: `A Tecno desenhou os seus telemóveis para África: bateria para dois dias, câmaras afinadas e preço justo. O Spark lidera nas vendas em ${loc}, o Camon aposta na fotografia e o Pova traz potência para jogos. Assistência e acessórios fáceis de encontrar em Angola.`,
      cta: `Anuncie o seu Tecno gratuitamente em ${loc} no Ambo Market!`,
    }),
    xiaomi: loc => ({
      intro: `Compre ou venda Xiaomi em ${loc} no Ambo Market. Redmi Note, Redmi, POCO e Mi — máximo equipamento pelo menor preço, novos e usados, em kwanza (AOA).`,
      body: `A Xiaomi é imbatível em custo-benefício: o Redmi Note dá ecrã AMOLED e câmara de topo por preço médio, e os POCO dominam nos jogos. Em ${loc}, os Xiaomi usados mantêm-se actualizados e são dos telemóveis mais anunciados do Ambo Market.`,
      cta: `Venda o seu Xiaomi gratuitamente em ${loc} e receba contactos no próprio dia!`,
    }),
    huawei: loc => ({
      intro: `Encontre telemóveis Huawei em ${loc} no Ambo Market. P30, P40, Mate, Nova e Y — fotografia de referência e construção sólida, novos e usados, em kwanza (AOA).`,
      body: `A Huawei marcou o mercado com câmaras Leica e acabamento premium. Em ${loc}, os P30 e Mate usados continuam óptimas compras pelo preço, e a série Nova atrai os mais jovens. Verifique a compatibilidade com as apps que usa antes de comprar os modelos mais recentes.`,
      cta: `Anuncie o seu Huawei gratuitamente em ${loc} no Ambo Market!`,
    }),
    oppo: loc => ({
      intro: `Compre ou venda OPPO em ${loc} no Ambo Market. Reno, A78, A58 e Find X — design fino e carregamento super-rápido, novos e usados, com preços em kwanza (AOA).`,
      body: `A OPPO destaca-se pelo carregamento VOOC que enche a bateria em minutos e por selfies de qualidade. A série Reno cresce em ${loc} entre quem quer design premium sem preço de topo, e a série A oferece fiabilidade acessível.`,
      cta: `Venda o seu OPPO gratuitamente em ${loc} no Ambo Market!`,
    }),
    infinix: loc => ({
      intro: `Compre ou venda Infinix em ${loc} no Ambo Market. Hot 40, Note 40, Smart 8 e Zero — ecrãs grandes e baterias potentes a preço acessível, novos e usados, em kwanza (AOA).`,
      body: `A Infinix (grupo Transsion, como a Tecno e a itel) é das marcas mais vendidas de África: a série Hot dá muito telemóvel por pouco dinheiro, a Note traz ecrãs AMOLED grandes e carregamento rápido, e a Smart é entrada acessível ao smartphone. Em ${loc}, os Infinix novos e usados vendem-se depressa pela relação preço-equipamento.`,
      cta: `Venda o seu Infinix gratuitamente em ${loc} — telemóveis acessíveis têm sempre comprador!`,
    }),
    honor: loc => ({
      intro: `Encontre telemóveis Honor em ${loc} no Ambo Market. X8, X9, Honor 90 e Magic — design premium e boas câmaras a preço competitivo, novos e usados, em kwanza (AOA).`,
      body: `A Honor é das marcas que mais crescem em África: herdou a engenharia da Huawei mas com serviços Google completos. A série X domina no custo-benefício, o Honor 90 aposta na câmara de selfie e os Magic competem no topo de gama. Em ${loc}, os Honor usados são alternativa fresca aos suspeitos do costume.`,
      cta: `Anuncie o seu Honor gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  computers: {
    hp: loc => ({
      intro: `Compre ou venda computadores HP em ${loc} no Ambo Market. Pavilion, EliteBook, ProBook, Victus e OMEN — portáteis para trabalho, estudo e jogos, novos e usados, em kwanza (AOA).`,
      body: `A HP é a marca mais comum nos escritórios de Angola: os EliteBook e ProBook usados de empresa são das melhores compras do mercado — construção sólida a preço reduzido. Para estudantes, o Pavilion resolve tudo; para jogos, Victus e OMEN. Peças e carregadores fáceis de encontrar em ${loc}.`,
      cta: `Venda o seu portátil HP gratuitamente em ${loc} — computadores para estudo têm procura constante!`,
    }),
    dell: loc => ({
      intro: `Encontre computadores Dell em ${loc} no Ambo Market. Latitude, Inspiron, XPS, Vostro e Alienware — do empresarial ao gaming, novos e usados, com preços em kwanza (AOA).`,
      body: `A Dell é referência em durabilidade: os Latitude ex-empresa aguentam anos de uso e custam uma fracção do preço novo, o XPS compete com o MacBook em acabamento e o Alienware domina nos jogos. Em ${loc}, os Dell usados são aposta segura para trabalho e estudo.`,
      cta: `Anuncie o seu Dell gratuitamente em ${loc} no Ambo Market!`,
    }),
    asus: loc => ({
      intro: `Compre ou venda computadores ASUS em ${loc} no Ambo Market. VivoBook, ZenBook, TUF e ROG — portáteis leves e máquinas de gaming, novos e usados, em kwanza (AOA).`,
      body: `A ASUS cobre todos os perfis: o VivoBook é económico para o dia-a-dia, o ZenBook é fino e premium, e as linhas TUF e ROG são das mais procuradas por gamers em ${loc}. Boa relação equipamento-preço em novos e usados.`,
      cta: `Venda o seu ASUS gratuitamente em ${loc} no Ambo Market!`,
    }),
    lenovo: loc => ({
      intro: `Encontre computadores Lenovo em ${loc} no Ambo Market. ThinkPad, IdeaPad, Legion e Yoga — dos lendários portáteis de empresa aos gaming, novos e usados, em kwanza (AOA).`,
      body: `O ThinkPad é o portátil de trabalho mais respeitado do mundo: teclado imbatível e resistência comprovada — os usados ex-empresa são das melhores compras em ${loc}. O IdeaPad serve estudo e casa, e o Legion é topo entre os gaming.`,
      cta: `Anuncie o seu Lenovo gratuitamente em ${loc} no Ambo Market!`,
    }),
    apple: loc => ({
      intro: `Compre ou venda Mac em ${loc} no Ambo Market. MacBook Air, MacBook Pro, iMac e Mac mini — com chips M1, M2 e M3, novos e usados, com preços em kwanza (AOA).`,
      body: `O MacBook mantém valor como nenhum outro portátil: os Air M1 usados continuam rápidos, silenciosos e com bateria para o dia inteiro — ideais para designers, programadores e estudantes em ${loc}. Verifique ciclos de bateria e bloqueio de activação antes de comprar.`,
      cta: `Venda o seu MacBook gratuitamente em ${loc} — é dos portáteis mais procurados do Ambo Market!`,
    }),
    acer: loc => ({
      intro: `Encontre computadores Acer em ${loc} no Ambo Market. Aspire, Swift, Nitro e Predator — portáteis acessíveis e gaming com bom preço, novos e usados, em kwanza (AOA).`,
      body: `A Acer é campeã do custo-benefício: o Aspire é dos portáteis novos mais baratos para estudo em ${loc}, e o Nitro 5 é a entrada mais acessível no gaming a sério. Boa opção para equipar escritórios e salas de aula sem gastar muito.`,
      cta: `Venda o seu Acer gratuitamente em ${loc} no Ambo Market!`,
    }),
    msi: loc => ({
      intro: `Compre ou venda computadores MSI em ${loc} no Ambo Market. Katana, Cyborg, Raider e Stealth — máquinas de gaming e criação, novas e usadas, com preços em kwanza (AOA).`,
      body: `A MSI é especialista em gaming: placas gráficas potentes, ecrãs de alta taxa de actualização e refrigeração pensada para horas de jogo. Em ${loc}, os MSI usados permitem entrar no gaming de topo por bem menos que o preço de novo.`,
      cta: `Anuncie o seu MSI gratuitamente em ${loc} no Ambo Market!`,
    }),
    huawei: loc => ({
      intro: `Encontre computadores Huawei em ${loc} no Ambo Market. MateBook D, MateBook X e MateBook 14 — design fino, ecrãs excelentes e bom preço, novos e usados, em kwanza (AOA).`,
      body: `Os MateBook surpreendem pelo acabamento metálico e ecrãs de qualidade a preço competitivo. Integração perfeita com telemóveis Huawei e autonomia sólida fazem deles boa escolha para trabalho e estudo em ${loc}.`,
      cta: `Venda o seu MateBook gratuitamente em ${loc} no Ambo Market!`,
    }),
  },
  gaming: {
    sony: loc => ({
      intro: `Compre ou venda PlayStation em ${loc} no Ambo Market. PS5, PS4, PS4 Pro, comandos DualSense e jogos — consolas novas e usadas, com preços em kwanza (AOA).`,
      body: `A PlayStation domina o gaming em Angola: a PS5 é a consola mais desejada e a PS4 usada continua excelente compra com centenas de jogos baratos. Em ${loc}, encontre consolas, comandos extra e jogos físicos — verifique sempre o funcionamento antes de pagar.`,
      cta: `Venda a sua PlayStation gratuitamente em ${loc} — consolas vendem-se em dias no Ambo Market!`,
    }),
    microsoft: loc => ({
      intro: `Encontre Xbox em ${loc} no Ambo Market. Xbox Series X, Series S, Xbox One e comandos — consolas novas e usadas, com jogos e acessórios, em kwanza (AOA).`,
      body: `A Xbox Series S é a porta de entrada mais barata para a nova geração, e a Series X é potência pura. Em ${loc}, as Xbox One usadas custam pouco e dão acesso a um catálogo enorme. O Game Pass torna a Xbox especialmente económica para quem joga muito.`,
      cta: `Anuncie a sua Xbox gratuitamente em ${loc} no Ambo Market!`,
    }),
    nintendo: loc => ({
      intro: `Compre ou venda Nintendo em ${loc} no Ambo Market. Switch, Switch OLED, Switch Lite e jogos — a consola híbrida para toda a família, nova e usada, em kwanza (AOA).`,
      body: `A Nintendo Switch joga-se na TV e em qualquer lugar: Mario, Zelda e Pokémon fazem dela a consola familiar por excelência. Em ${loc}, a Switch Lite usada é presente acessível para crianças, e os jogos Nintendo mantêm valor durante anos.`,
      cta: `Venda a sua Nintendo Switch gratuitamente em ${loc} no Ambo Market!`,
    }),
    valve: loc => ({
      intro: `Encontre Steam Deck em ${loc} no Ambo Market. Steam Deck LCD e OLED — o PC de jogos portátil da Valve, novo e usado, com preços em kwanza (AOA).`,
      body: `O Steam Deck leva a biblioteca Steam inteira para a palma da mão: milhares de jogos de PC em formato portátil. Ainda raro em Angola, cada anúncio em ${loc} atrai muitos interessados — boa oportunidade tanto para vender como para comprar.`,
      cta: `Anuncie o seu Steam Deck gratuitamente em ${loc} — a procura supera a oferta!`,
    }),
  },
};

export function getBrandSeoText(subcategoryId: string, brandId: string, loc: string): BrandSeoText | undefined {
  return BRAND_SEO_TEXTS[subcategoryId]?.[brandId]?.(loc);
}
