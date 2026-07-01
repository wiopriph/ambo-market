<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import formatCurrency from '~/utils/formatCurrency';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { Post as ProductPost, ProductApiResponse, User } from '~/types/product';
import { formatFullDate } from '~/utils/formatDate';
import { useUser } from '~/composables/useUser';
import { getPostRoute } from '~/utils/getPostRoute';
import { CLICK_AD_PHOTO } from '~/constants/analytics-events';
import { getBrandName, getCategoryName, getSubcategoryName } from '~/constants/categories';
import { formatAttributeValue, getProductAttributeFields } from '~/constants/productAttributes';


type BreadcrumbDepth = 'category' | 'subcategory' | 'brand';
type Breadcrumb = {
  title: string;
  to?: RouteLocationRaw;
};
type CarouselApi = {
  scrollTo: (index: number) => void;
};
type CarouselInstance = {
  emblaApi?: CarouselApi | { value?: CarouselApi };
};

const props = withDefaults(defineProps<{
  breadcrumbDepth?: BreadcrumbDepth;
}>(), {
  breadcrumbDepth: 'category',
});

const { pushEvent } = useAnalyticsEvent();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const postId = computed(() => `${route.params.productId}`);

const { data: product, error } = await useAsyncData<ProductApiResponse>(
  () => `post-${route.params.productId}`,
  async () => {
    try {
      const response = await $fetch<{ post: any; user: any }>(`/api/posts/${postId.value}`);

      const { post, user } = response as ProductApiResponse;

      const postCityId = post?.location?.cityId ?? 'all';
      const canonicalRoute = getPostRoute({
        productId: post?.id,
        brandId: post?.brandId,
        subcategoryId: post?.subcategoryId,
        categoryId: post?.categoryId,
        cityId: postCityId,
      });

      if (route.name !== canonicalRoute.name ||
        Object.entries(canonicalRoute.params).some(([key, value]) => route.params[key] !== value)) {
        navigateTo(canonicalRoute, { redirectCode: 301 });
      }

      return {
        post,
        user,
      };
    } catch (error) {
      if (error?.statusCode === 404 || error?.message === 'Post not found') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not found',
          fatal: true,
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load product data',
        fatal: true,
      });
    }
  },
);

if (error && error?.value) {
  throw createError(error?.value);
}

const { data: recommendedPosts } = await useAsyncData<ProductPost[]>(
  () => `recommendedPosts-${route.params.productId}`,
  async () => {
    const response = await $fetch<{
      posts: ProductPost[]
    }>(`/api/posts/${postId.value}/recommended`, { params: { limit: 4 } });

    return response?.posts || [];
  },
  { watch: [() => route.params] },
);

const seller = computed({
  get: () => product.value?.user,
  set: (value: User) => {
    if (product.value && product.value?.user) {
      product.value.user = value;
    }
  },
});
const post = computed(() => product.value?.post);

const categoryId = computed(() => post.value?.categoryId);
const postCategoryName = computed(() => getCategoryName(categoryId.value ?? ''));

const subcategoryId = computed(() => post.value?.subcategoryId);
const postSubcategoryName = computed(() => getSubcategoryName(categoryId.value ?? '', subcategoryId.value ?? ''));

const brandId = computed(() => post.value?.brandId);
const postBrandName = computed(() => getBrandName(categoryId.value ?? '', subcategoryId.value ?? '', brandId.value ?? ''));

const postLocation = computed(() => post.value?.location);
const postCityId = computed(() => postLocation.value?.cityId ?? 'all');
const postCityName = computed(() => postLocation.value?.cityName);

const formattedPrice = computed(() => formatCurrency(`${post.value?.price}`));
const formattedDate = computed(() => post.value?.createdAt ? formatFullDate(post.value?.createdAt, 'pt') : '');
const productImages = computed(() => {
  const images = post.value?.images?.filter(Boolean) ?? [];

  if (images.length) {
    return images;
  }

  return post.value?.preview ? [post.value.preview] : [];
});

const carousel = ref<CarouselInstance | null>(null);
const activeImageIndex = ref(0);
const fallbackImage = '/blog-placeholder.png';
const carouselSlides = computed(() => productImages.value.map((url, index) => ({
  url,
  index,
  alt: `${post.value?.title || 'Fotos'} ${index + 1}`,
})));
const hasGalleryImages = computed(() => carouselSlides.value.length > 0);

watch(carouselSlides, () => {
  activeImageIndex.value = 0;
});

const setActiveImage = (index: number) => {
  activeImageIndex.value = index;
};

const scrollCarouselTo = (index: number) => {
  const emblaApi = carousel.value?.emblaApi;

  if (!emblaApi) {
    return;
  }

  if ('value' in emblaApi) {
    emblaApi.value?.scrollTo(index);

    return;
  }

  emblaApi.scrollTo(index);
};

const selectImage = (index: number) => {
  // eslint-disable-next-line camelcase
  pushEvent(CLICK_AD_PHOTO, { product_id: postId.value });

  activeImageIndex.value = index;
  scrollCarouselTo(index);
};

const breadcrumbItems = computed(() => breadcrumbsList.value.map((item) => ({
  label: item.title,
  to: item.to,
})));

const attributeDetails = computed(() => {
  const fields = getProductAttributeFields(categoryId.value, subcategoryId.value);
  const attrs = post.value?.attributes ?? {};

  return fields
    .map(field => ({
      label: field.label,
      value: formatAttributeValue(field, attrs[field.key]),
      icon: 'i-lucide-list-checks',
    }))
    .filter(item => item.value);
});

const productDetails = computed(() => [
  {
    label: 'Localização',
    value: postCityName.value,
    icon: 'i-lucide-map-pin',
  },
  {
    label: 'Categoria',
    value: postCategoryName.value,
    icon: 'i-lucide-layout-grid',
  },
  {
    label: 'Subcategoria',
    value: postSubcategoryName.value,
    icon: 'i-lucide-list-tree',
  },
  {
    label: 'Marca',
    value: brandId.value ? postBrandName.value : '',
    icon: 'i-lucide-tag',
  },
  ...attributeDetails.value,
  {
    label: 'Publicado em',
    value: formattedDate.value,
    icon: 'i-lucide-calendar-days',
  },
].filter((item) => item.value));

const sellerDescription = computed(() => {
  if (seller.value?.phone) {
    return seller.value.phone;
  }

  return 'Vendedor';
});

const sellerAvatar = computed(() => ({
  src: seller.value?.photoURL,
  alt: seller.value?.name,
  text: seller.value?.name?.slice(0, 2).toUpperCase(),
}));

const phoneLink = computed(() => seller.value?.phone ? `tel:${seller.value.phone}` : undefined);
const isPostOpen = computed(() => post.value?.status === POST_STATUSES.OPEN);
const isPostUnavailable = computed(() => !isPostOpen.value);
const statusLabel = computed(() => {
  if (post.value?.status === POST_STATUSES.CLOSED) {
    return 'Fechado';
  }

  if (post.value?.status === 'archived') {
    return 'Arquivado';
  }

  if (post.value?.status === POST_STATUSES.HOLD) {
    return 'Em espera';
  }

  return 'Ativo';
});

const statusColor = computed(() => {
  if (post.value?.status === POST_STATUSES.HOLD) {
    return 'warning';
  }

  return isPostOpen.value ? 'success' : 'neutral';
});
const shareUrl = computed(() => {
  const baseUrl = runtimeConfig.public.appBaseUrl;

  if (!baseUrl) {
    return route.fullPath;
  }

  return new URL(route.fullPath, baseUrl).toString();
});

const encodedShareUrl = computed(() => encodeURIComponent(shareUrl.value));
const encodedShareText = computed(() => encodeURIComponent(`${post.value?.title || ''} ${shareUrl.value}`.trim()));

const copyShareLink = async () => {
  if (!import.meta.client || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(shareUrl.value);

  toast.add({
    title: 'Link copiado',
    color: 'success',
    icon: 'i-lucide-check',
  });
};

const recommendedPostsList = computed(() => recommendedPosts.value ?? []);

const getRecommendedPostTo = (product: ProductPost) => getPostRoute({
  cityId: product.location?.cityId ?? 'all',
  categoryId: product.categoryId,
  subcategoryId: product.subcategoryId,
  brandId: product.brandId,
  productId: product.id,
});

type ProductSeoEntry = { title: string; description: string };

const PRODUCT_SEO: Record<string, { city: ProductSeoEntry; everywhere: ProductSeoEntry }> = {
  vehicles: {
    city: {
      title: 'Comprar {title} em {city} | Veículos | Ambo Market',
      description: 'Compre {title} em {city} – carros, motas, barcos e mais. Apenas anúncios verificados. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Veículos | Ambo Market',
      description: 'Explore {title} à venda – carros, motas e veículos comerciais. {description}',
    },
  },
  'real-estate': {
    city: {
      title: '{title} em {city} | Imóveis | Ambo Market',
      description: 'Encontre {title} em {city} – casas, terrenos, apartamentos e imóveis comerciais. {description}',
    },
    everywhere: {
      title: '{title} | Imóveis | Ambo Market',
      description: 'Veja {title} para venda ou aluguel – imóveis em toda Angola. {description}',
    },
  },
  electronics: {
    city: {
      title: 'Comprar {title} em {city} | Eletrônicos | Ambo Market',
      description: 'À procura de {title} em {city}? Veja telemóveis, computadores, TVs e mais. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Eletrônicos | Ambo Market',
      description: 'Compre {title} no Ambo Market – smartphones, gadgets, computadores e muito mais. {description}',
    },
  },
  fashion: {
    city: {
      title: 'Comprar {title} em {city} | Moda | Ambo Market',
      description: 'Encontre {title} em {city} – roupas, calçados e acessórios com ótimos preços. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Moda | Ambo Market',
      description: 'Compre {title} – descubra ofertas de moda em toda Angola. {description}',
    },
  },
  jobs: {
    city: {
      title: '{title} em {city} | Empregos | Ambo Market',
      description: 'Vaga de emprego: {title} em {city}. Candidate-se agora ou veja outras oportunidades. {description}',
    },
    everywhere: {
      title: '{title} | Empregos | Ambo Market',
      description: 'Oferta de emprego: {title}. Encontre oportunidades de carreira em Angola. {description}',
    },
  },
  services: {
    city: {
      title: '{title} em {city} | Serviços | Ambo Market',
      description: 'Encontre {title} em {city} – serviços confiáveis para pessoas e empresas. {description}',
    },
    everywhere: {
      title: '{title} | Serviços | Ambo Market',
      description: 'Serviço oferecido: {title}. Publique ou encontre serviços de confiança em Angola. {description}',
    },
  },
  animals: {
    city: {
      title: 'Comprar {title} em {city} | Animais | Ambo Market',
      description: 'Encontre {title} em {city} – animais de estimação, gado e acessórios. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Animais | Ambo Market',
      description: '{title} – animais domésticos, exóticos ou de fazenda em toda Angola. {description}',
    },
  },
  hobby: {
    city: {
      title: 'Comprar {title} em {city} | Lazer & Passatempos | Ambo Market',
      description: 'Encontre {title} em {city} – desporto, música, jogos, coleções e mais. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Lazer & Passatempos | Ambo Market',
      description: 'Compre {title} no Ambo Market – tudo para os seus passatempos: jogos, música, desporto e artesanato. {description}',
    },
  },
  kids: {
    city: {
      title: 'Comprar {title} em {city} | Artigos Infantis | Ambo Market',
      description: 'À procura de {title} em {city}? Encontre brinquedos, roupas e artigos para bebés. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Artigos Infantis | Ambo Market',
      description: 'Compre {title} – brinquedos, roupas e muito mais para crianças em toda Angola. {description}',
    },
  },
  home: {
    city: {
      title: 'Comprar {title} em {city} | Casa & Jardim | Ambo Market',
      description: 'Encontre {title} em {city} – móveis, eletrodomésticos, decoração e mais. {description}',
    },
    everywhere: {
      title: 'Comprar {title} | Casa & Jardim | Ambo Market',
      description: 'Explore {title} para sua casa. Compre ou venda móveis, ferramentas e acessórios. {description}',
    },
  },
};

const fillStr = (str: string, vars: Record<string, string>) =>
  str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? _);

const seo = computed(() => {
  const cityKey = postCityId.value && postCityName.value ? 'city' : 'everywhere';
  const catSeo = PRODUCT_SEO[categoryId.value ?? ''];
  const entry = catSeo?.[cityKey];

  const vars = {
    title: post.value?.title ?? '',
    city: postCityName.value ?? '',
    description: (post.value?.description ?? '').replace(/[\r\n]+/g, ' '),
  };

  const title = entry ? fillStr(entry.title, vars) : (post.value?.title ?? '');
  const description = entry ? fillStr(entry.description, vars) : (post.value?.description ?? '');
  const image = post.value?.preview || '';

  return { title, description, image };
});

const title = computed(() => seo.value.title);

const meta = computed(() => [
  { key: 'description', name: 'description', content: seo.value.description },
  { key: 'og:type', property: 'og:type', content: 'product' },
  { key: 'og:title', property: 'og:title', content: seo.value.title },
  { key: 'og:description', property: 'og:description', content: seo.value.description },
  { key: 'og:image', property: 'og:image', content: seo.value.image },
  { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
  { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
  { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
  { key: 'twitter:image', property: 'twitter:image', content: seo.value.image },
]);

const script = computed(() => [{
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    identifier: post.value?.id,
    name: post.value?.title,
    image: post.value?.images,
    description: post.value?.description,
    category: postCategoryName.value,

    offers: {
      '@type': 'Offer',
      price: post.value?.price || 0,
      priceCurrency: 'AOA',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2099-12-31T23:59:59Z',
      seller: {
        '@type': 'Person',
        name: seller.value?.name,
        identifier: seller.value?.id,
      },
    },
  }),
}]);

useHead({ title: title.value, meta: meta.value, script: script.value });

const breadcrumbsList = computed(() => {
  const breadcrumbs: Breadcrumb[] = [{
    title: 'Início',
    to: {
      name: 'cityId',
      params: {
        cityId: postCityId.value,
      },
    },
  }, {
    title: postCategoryName.value,
    to: {
      name: 'cityId-categoryId',
      params: {
        categoryId: categoryId.value,
        cityId: postCityId.value,
      },
    },
  }];

  if (props.breadcrumbDepth === 'subcategory' || props.breadcrumbDepth === 'brand') {
    breadcrumbs.push({
      title: postSubcategoryName.value,
      to: {
        name: 'cityId-categoryId-subcategoryId',
        params: {
          categoryId: categoryId.value,
          subcategoryId: subcategoryId.value,
          cityId: postCityId.value,
        },
      },
    });
  }

  if (props.breadcrumbDepth === 'brand') {
    breadcrumbs.push({
      title: postBrandName.value,
      to: {
        name: 'cityId-categoryId-subcategoryId-brandId',
        params: {
          categoryId: categoryId.value,
          subcategoryId: subcategoryId.value,
          brandId: brandId.value,
          cityId: postCityId.value,
        },
      },
    });
  }

  breadcrumbs.push({ title: `${post.value?.title}` });

  return breadcrumbs;
});

const { uid } = useUser();

const isOwnerUser = computed(() => uid.value === seller.value?.id);
const hasControlButtons = computed(() => post.value?.status === POST_STATUSES.OPEN);


const isClosePostModalVisible = ref(false);

const closePost = () => {
  if (product.value?.post) {
    product.value.post.status = POST_STATUSES.CLOSED;
  }
};
</script>

<template>
  <div class="space-y-4 pb-24 lg:pb-0">
    <UBreadcrumb
      :items="breadcrumbItems"
      class="hidden sm:flex"
    />

    <section v-if="post && seller">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <!-- Left column -->
        <div class="space-y-4">
          <!-- Gallery -->
          <div class="overflow-hidden rounded-2xl border border-default bg-default">
            <div class="relative">
              <UCarousel
                v-if="hasGalleryImages"
                ref="carousel"
                v-slot="{ item: slide }"
                :items="carouselSlides"
                :arrows="carouselSlides.length > 1"
                :prev="{ color: 'neutral', variant: 'soft', size: 'lg' }"
                :next="{ color: 'neutral', variant: 'soft', size: 'lg' }"
                :ui="{ container: 'flex w-full ms-0', item: 'basis-full shrink-0 ps-0' }"
                fade
                loop
                class="w-full overflow-hidden"
                @select="setActiveImage"
              >
                <div class="aspect-square w-full overflow-hidden sm:aspect-[4/3]">
                  <img
                    :src="slide.url"
                    :alt="slide.alt"
                    class="h-full w-full object-cover"
                    @click="selectImage(slide.index)"
                  >
                </div>
              </UCarousel>

              <div
                v-else
                class="aspect-square w-full overflow-hidden sm:aspect-[4/3]"
              >
                <img
                  :src="fallbackImage"
                  :alt="post.title"
                  class="h-full w-full object-cover"
                >
              </div>

              <div class="absolute bottom-3 left-3 flex gap-2">
                <UBadge
                  v-if="carouselSlides.length > 1"
                  color="neutral"
                  variant="solid"
                  class="bg-black/60 text-white backdrop-blur-sm"
                >
                  {{ activeImageIndex + 1 }} / {{ carouselSlides.length }}
                </UBadge>

                <UBadge
                  v-if="isPostUnavailable"
                  :color="statusColor"
                  variant="subtle"
                  class="backdrop-blur-sm"
                >
                  {{ statusLabel }}
                </UBadge>
              </div>
            </div>

            <!-- Thumbnails -->
            <div
              v-if="carouselSlides.length > 1"
              class="hidden gap-2 overflow-x-auto px-4 py-3 md:flex"
            >
              <button
                v-for="(thumb, i) in carouselSlides"
                :key="i"
                type="button"
                class="size-14 shrink-0 overflow-hidden rounded-lg border-2 transition"
                :class="activeImageIndex === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'"
                @click="selectImage(i)"
              >
                <img
                  :src="thumb.url"
                  :alt="thumb.alt"
                  class="h-full w-full object-cover"
                  loading="lazy"
                >
              </button>
            </div>
          </div>

          <!-- Title + meta (mobile) -->
          <div class="rounded-2xl border border-default bg-default px-5 py-4 lg:hidden">
            <h1
              class="text-xl font-bold text-highlighted"
              v-text="post.title"
            />

            <p
              class="mt-1 text-2xl font-bold text-primary"
              v-text="formattedPrice"
            />

            <div class="mt-2 flex flex-wrap gap-3 text-sm text-muted">
              <span
                v-if="postCityName"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-4"
                />
                {{ postCityName }}
              </span>

              <span
                v-if="formattedDate"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-lucide-calendar-days"
                  class="size-4"
                />
                {{ formattedDate }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div
            v-if="post.description"
            class="rounded-2xl border border-default bg-default overflow-hidden"
          >
            <div class="border-b border-default px-5 py-3">
              <p
                class="text-sm font-semibold text-highlighted"
                v-text="'Descrição do produto'"
              />
            </div>

            <div class="px-5 py-4">
              <p
                class="whitespace-pre-line text-sm leading-relaxed text-toned"
                v-text="post.description"
              />
            </div>
          </div>

          <!-- Details -->
          <div
            v-if="productDetails.length"
            class="rounded-2xl border border-default bg-default overflow-hidden"
          >
            <div class="border-b border-default px-5 py-3">
              <p
                class="text-sm font-semibold text-highlighted"
                v-text="'Detalhes'"
              />
            </div>

            <dl class="divide-y divide-default">
              <div
                v-for="item in productDetails"
                :key="item.label"
                class="flex items-center gap-3 px-5 py-3"
              >
                <UIcon
                  :name="item.icon"
                  class="size-4 shrink-0 text-muted"
                />

                <dt
                  class="w-28 shrink-0 text-sm text-muted"
                  v-text="item.label"
                />

                <dd
                  class="truncate text-sm font-medium text-highlighted"
                  v-text="item.value"
                />
              </div>
            </dl>
          </div>
        </div>

        <!-- Right: sticky sidebar -->
        <aside class="space-y-4 lg:sticky lg:top-[74px] lg:self-start">
          <!-- Title + meta (desktop) -->
          <div class="hidden rounded-2xl border border-default bg-default px-5 py-4 lg:block">
            <div class="flex items-start gap-2">
              <h1
                class="flex-1 text-xl font-bold text-highlighted"
                v-text="post.title"
              />

              <UDropdownMenu
                :items="[[
                  { label: 'WhatsApp', icon: 'i-simple-icons-whatsapp', to: `https://wa.me/?text=${encodedShareText}`, target: '_blank' },
                  { label: 'Facebook', icon: 'i-simple-icons-facebook', to: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`, target: '_blank' },
                  { label: 'Copiar link', icon: 'i-lucide-link', onSelect: copyShareLink },
                ]]"
              >
                <UButton
                  icon="i-lucide-share-2"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  aria-label="Compartilhar anúncio"
                />
              </UDropdownMenu>
            </div>

            <p
              class="mt-1 text-2xl font-bold text-primary"
              v-text="formattedPrice"
            />

            <div class="mt-2 flex flex-wrap gap-3 text-sm text-muted">
              <span
                v-if="postCityName"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-4"
                />
                {{ postCityName }}
              </span>

              <span
                v-if="formattedDate"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-lucide-calendar-days"
                  class="size-4"
                />
                {{ formattedDate }}
              </span>
            </div>
          </div>

          <!-- Contact card -->
          <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
            <div class="px-5 py-4">
              <UUser
                :name="seller.name"
                :description="sellerDescription"
                :avatar="sellerAvatar"
                :to="{ name: 'user-userUid-status', params: { userUid: seller.id } }"
                size="lg"
              />
            </div>

            <div class="px-5 py-4">
              <UButton
                v-if="hasControlButtons && isOwnerUser"
                label="Fechar anúncio"
                icon="i-lucide-lock"
                color="neutral"
                variant="soft"
                block
                @click="isClosePostModalVisible = true"
              />

              <UButton
                v-else
                label="Ligar ao vendedor"
                :href="phoneLink"
                icon="i-lucide-phone"
                color="primary"
                block
                :disabled="!phoneLink || isPostUnavailable"
              />
            </div>
          </div>

          <!-- Share (mobile only) -->
          <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden lg:hidden">
            <div class="px-5 py-3">
              <p
                class="text-xs font-medium text-muted uppercase tracking-wide"
                v-text="'Compartilhar anúncio'"
              />
            </div>

            <NuxtLink
              :href="`https://wa.me/?text=${encodedShareText}`"
              target="_blank"
              class="flex items-center gap-3 px-5 py-3.5 transition hover:bg-elevated"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                <UIcon
                  name="i-simple-icons-whatsapp"
                  class="size-4 text-[#25D366]"
                />
              </div>

              <span class="flex-1 text-sm text-highlighted">WhatsApp</span>

              <UIcon
                name="i-lucide-chevron-right"
                class="size-4 text-muted"
              />
            </NuxtLink>

            <NuxtLink
              :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`"
              target="_blank"
              class="flex items-center gap-3 px-5 py-3.5 transition hover:bg-elevated"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#1877F2]/10">
                <UIcon
                  name="i-simple-icons-facebook"
                  class="size-4 text-[#1877F2]"
                />
              </div>

              <span class="flex-1 text-sm text-highlighted">Facebook</span>

              <UIcon
                name="i-lucide-chevron-right"
                class="size-4 text-muted"
              />
            </NuxtLink>

            <button
              type="button"
              class="flex w-full items-center gap-3 px-5 py-3.5 transition hover:bg-elevated"
              @click="copyShareLink"
            >
              <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <UIcon
                  name="i-lucide-link"
                  class="size-4 text-primary"
                />
              </div>

              <span
                class="flex-1 text-left text-sm text-highlighted"
                v-text="'Copiar link'"
              />

              <UIcon
                name="i-lucide-chevron-right"
                class="size-4 text-muted"
              />
            </button>
          </div>
        </aside>
      </div>

      <!-- Mobile sticky CTA -->
      <div class="fixed inset-x-0 bottom-0 z-20 border-t border-default bg-default/95 backdrop-blur-sm lg:hidden">
        <div class="px-4 py-3 space-y-2">
          <div class="flex items-baseline justify-between">
            <p
              class="text-xl font-bold text-highlighted"
              v-text="formattedPrice"
            />

            <p
              v-if="postCityName"
              class="text-xs text-muted flex items-center gap-1"
            >
              <UIcon
                name="i-lucide-map-pin"
                class="size-3"
              />
              {{ postCityName }}
            </p>
          </div>

          <div class="flex gap-2">
            <UButton
              v-if="hasControlButtons && isOwnerUser"
              label="Fechar anúncio"
              icon="i-lucide-lock"
              color="neutral"
              variant="soft"
              class="flex-1"
              @click="isClosePostModalVisible = true"
            />

            <template v-else>
              <UButton
                label="Ligar ao vendedor"
                :href="phoneLink"
                icon="i-lucide-phone"
                color="primary"
                class="flex-1"
                :disabled="!phoneLink || isPostUnavailable"
              />

              <UButton
                v-if="false"
                icon="i-simple-icons-whatsapp"
                color="neutral"
                variant="soft"
                size="md"
                :href="`https://wa.me/?text=${encodedShareText}`"
                target="_blank"
                aria-label="WhatsApp"
              />
            </template>
          </div>
        </div>
      </div>

      <LazyProductCloseModal
        v-if="isClosePostModalVisible"
        :postId="postId"
        @change-status="closePost"
        @close="isClosePostModalVisible = false"
      />
    </section>

    <!-- Related listings -->
    <div v-if="recommendedPostsList.length">
      <h2
        class="mb-3 text-sm font-semibold text-highlighted"
        v-text="'Anúncios Relacionados'"
      />

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NuxtLink
          v-for="recommendedPost in recommendedPostsList"
          :key="recommendedPost.id"
          :to="getRecommendedPostTo(recommendedPost)"
          class="group overflow-hidden rounded-2xl border border-default bg-default transition hover:border-primary/40 hover:shadow-sm"
        >
          <div class="relative aspect-square overflow-hidden bg-muted">
            <img
              v-if="recommendedPost.preview"
              :src="recommendedPost.preview"
              :alt="recommendedPost.title"
              class="size-full object-cover transition group-hover:scale-105"
              loading="lazy"
            >

            <UEmpty
              v-else
              icon="i-lucide-image-off"
              title="Sem foto"
              class="h-full"
            />
          </div>

          <div class="p-3">
            <p
              class="truncate text-sm font-bold text-highlighted"
              v-text="formatCurrency(recommendedPost.price)"
            />

            <p
              class="mt-0.5 line-clamp-2 text-xs text-muted"
              v-text="recommendedPost.title"
            />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- SEO text -->
    <div
      v-if="post"
      class="rounded-2xl border border-default bg-default px-5 py-4"
    >
      <SeoProductText
        :productTitle="post.title"
        :category="postCategoryName"
        :price="formattedPrice"
        :city="postCityName"
        :seller="seller?.name"
        :productList="[]"
      />
    </div>
  </div>
</template>
