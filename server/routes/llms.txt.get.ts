import { serverSupabaseServiceRole } from '#supabase/server';
import { CATEGORIES } from '~/constants/categories';
import { CITIES, getCityById } from '~/constants/cities';
import { SUPPORT_EMAIL } from '~/constants/contacts';
import { getListingPages } from '~~/server/utils/listingPages';
import { getBlogArticles } from '~~/server/utils/blogArticles';


const MAX_LISTING_PAGES = 40;

/**
 * /llms.txt (https://llmstxt.org): карта сайта для LLM-агентов в Markdown.
 *
 * Статичная часть собирается из справочников, динамические секции (живые
 * страницы листингов из базы, статьи блога) обёрнуты в try/catch: файл
 * остаётся валидным (H1, ссылки, >50 символов) при любом сбое источников.
 */
export default defineCachedEventHandler(async (event) => {
  const base = (useRuntimeConfig(event).public.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');
  const url = (path: string) => `${base}${path}`;
  const link = (label: string, path: string) => `[${label}](${url(path)})`;

  const cities = CITIES.filter(city => city.id !== 'all');

  const listingLabel = (path: string) => {
    const [cityId, categoryId, subcategoryId, brandId] = path.split('/').filter(Boolean);
    const city = cityId === 'all' ? 'Toda Angola' : getCityById(cityId)?.name ?? cityId;
    const category = CATEGORIES.find(item => item.id === categoryId);
    const subcategory = category?.subcategories?.find(item => item.id === subcategoryId);
    const brand = subcategory?.brands?.find(item => item.id === brandId);

    return [city, category?.name, subcategory?.name, brand?.name].filter(Boolean).join(' / ');
  };

  let topListings: string[] = [];

  try {
    const pages = await getListingPages(serverSupabaseServiceRole(event));

    topListings = pages
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_LISTING_PAGES)
      .map(page => `- ${link(listingLabel(page.path), page.path)}: ${page.count} anúncios`);
  } catch {
    // база недоступна - секция пропускается
  }

  let blogLinks: string[] = [];

  try {
    blogLinks = (await getBlogArticles(event)).map(article =>
      `- ${link(article.title, article.path)}${article.description ? `: ${article.description}` : ''}`);
  } catch {
    // список статей недоступен - остаётся ссылка на /blog
  }

  const categoryLines = CATEGORIES.flatMap(category => [
    `- ${link(category.name, `/all/${category.id}`)}`,
    ...(category.subcategories ?? []).map(subcategory =>
      `  - ${link(subcategory.name, `/all/${category.id}/${subcategory.id}`)}`),
  ]);

  const lines = [
    '# Ambo Market',
    '',
    '> Marketplace de classificados grátis em Angola: carros, imóveis, telemóveis, electrónicos, emprego e serviços. Particulares e empresas publicam anúncios gratuitamente e negociam directamente entre si, sem comissões.',
    '',
    `- Site: ${base}`,
    '- Idioma: português (pt-AO)',
    '- Moeda: kwanza angolano (AOA); os preços dos anúncios são indicados em Kz',
    `- Cobertura: ${cities.map(city => city.name).join(', ')} e toda Angola`,
    `- Contacto: ${SUPPORT_EMAIL}`,
    '',
    '## Como funciona',
    '',
    `- Publicar: registo gratuito em ${url('/auth')}, depois "Publicar anúncio" em ${url('/product/create')}: categoria, fotos, descrição, preço em Kz e cidade. Os anúncios passam por moderação.`,
    '- Comprar: não há carrinho nem pagamento online. O comprador contacta o vendedor pelo chat do site ou pelo telefone (mostrado ao clicar em "Mostrar contacto") e combina entrega e pagamento directamente com ele.',
    '- A plataforma não cobra taxas de publicação nem comissões e não intermedeia pagamentos.',
    '- Cada anúncio tem o botão "Denunciar"; anúncios que violam as regras são removidos.',
    `- Pesquisa: ${url('/all?q=termo')} (toda Angola) ou ${url('/luanda?q=termo')} (por cidade); filtros de preço: minPrice e maxPrice; paginação: page.`,
    `- URL de listagem: ${url('/{cidade}/{categoria}/{subcategoria}/{marca}')}; anúncio: ${url('/{cidade}/{categoria}/.../{id}')}.`,
    '',
    '## Páginas principais',
    '',
    `- ${link('Página inicial', '/')}: anúncios mais recentes em toda Angola`,
    `- ${link('Cidades', '/cities')}: lista de cidades com anúncios`,
    `- ${link('Publicar anúncio', '/product/create')}`,
    `- ${link('Entrar ou registar', '/auth')}`,
    `- ${link('Blog', '/blog')}: guias de compra e venda`,
    `- ${link('Sobre o Ambo Market', '/about')}`,
    '',
    '## Categorias',
    '',
    ...categoryLines,
    '',
    '## Cidades',
    '',
    ...cities.map(city => `- ${link(city.name, `/${city.id}`)}`),
    ...(topListings.length ?
      ['', '## Páginas com mais anúncios', '', ...topListings] :
      []),
    '',
    '## Blog',
    '',
    `- ${link('Todas as publicações', '/blog')}`,
    ...blogLinks,
    '',
    '## Políticas',
    '',
    `- ${link('Termos de Uso', '/terms')}`,
    `- ${link('Política de Privacidade', '/privacy')}`,
    '',
    '## Para robôs',
    '',
    `- ${link('Sitemap', '/sitemap_index.xml')}`,
    `- ${link('robots.txt', '/robots.txt')}`,
    '',
  ];

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  return lines.join('\n');
}, {
  name: 'llms-txt',
  maxAge: 3600,
  swr: true,
  getKey: () => 'llms',
});
