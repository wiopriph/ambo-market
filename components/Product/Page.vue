<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import formatCurrency from '~/utils/formatCurrency';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { Post as ProductPost, ProductApiResponse, User } from '~/types/product';
import { formatFullDate } from '~/utils/formatDate';
import { useUser } from '~/composables/useUser';
import { getPostRoute } from '~/utils/getPostRoute';
import { CLICK_AD_PHOTO } from '~/constants/analytics-events';


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

const { t, locale } = useI18n();

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
const postCategoryName = computed(() => t(`categories.${categoryId.value}`));

const subcategoryId = computed(() => post.value?.subcategoryId);
const postSubcategoryName = computed(() => t(`subcategories.${subcategoryId.value}`));

const brandId = computed(() => post.value?.brandId);
const postBrandName = computed(() => t(`brands.${brandId.value}`));

const postLocation = computed(() => post.value?.location);
const postCityId = computed(() => postLocation.value?.cityId ?? 'all');
const postCityName = computed(() => postLocation.value?.cityName);

const formattedPrice = computed(() => formatCurrency(`${post.value?.price}`));
const formattedDate = computed(() => post.value?.createdAt ? formatFullDate(post.value?.createdAt, locale.value) : '');
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
  alt: `${post.value?.title || t('photos')} ${index + 1}`,
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

const productDetails = computed(() => [
  {
    label: t('location'),
    value: postCityName.value,
    icon: 'i-lucide-map-pin',
  },
  {
    label: t('category'),
    value: postCategoryName.value,
    icon: 'i-lucide-layout-grid',
  },
  {
    label: t('subcategory'),
    value: postSubcategoryName.value,
    icon: 'i-lucide-list-tree',
  },
  {
    label: t('brand'),
    value: brandId.value ? postBrandName.value : '',
    icon: 'i-lucide-tag',
  },
  {
    label: t('posted'),
    value: formattedDate.value,
    icon: 'i-lucide-calendar-days',
  },
].filter((item) => item.value));

const sellerDescription = computed(() => {
  if (seller.value?.phone) {
    return seller.value.phone;
  }

  return t('seller');
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
    return t('status_closed');
  }

  if (post.value?.status === 'archived') {
    return t('status_archived');
  }

  if (post.value?.status === POST_STATUSES.HOLD) {
    return t('status_hold');
  }

  return t('status_open');
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
    title: t('link_copied'),
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

const seo = computed(() => {
  const translationKey = postCityId.value && postCityName.value ? 'city' : 'everywhere';

  const title = t(`${categoryId.value}.${translationKey}.title`, {
    title: post.value?.title,
    city: postCityName.value,
  });

  const description = t(`${categoryId.value}.${translationKey}.description`, {
    title: post.value?.title,
    city: postCityName.value,
    description: post.value?.description?.replace(/[\r\n]+/g, ' '),
  });

  const image = post.value?.preview || '';

  return {
    title,
    description,
    image,
  };
});

const title = computed(() => seo.value.title);

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: seo.value.title },
  { key: 'og:description', property: 'og:description', content: seo.value.description },
  { hid: 'og:image', property: 'og:image', content: seo.value.image },

  { key: 'description', name: 'description', content: seo.value.description },

  { hid: 'twitter:image', property: 'twitter:image', content: seo.value.image },
  { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
  { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
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
    title: 'Main',
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

<i18n lang="json">
{
  "en": {
    "contact_seller": "Contact the Seller",
    "location": "Location",
    "category": "Category",
    "description": "Description",
    "posted": "Posted On",
    "share": "Share Listing",
    "related_listings": "Related Listings",
    "seller": "Seller",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "photos": "Photos",
    "details": "Details",
    "call_seller": "Call seller",
    "close_post": "Close ad",
    "no_photo": "No photo",
    "status_open": "Active",
    "status_hold": "On hold",
    "status_closed": "Closed",
    "status_archived": "Archived",
    "link_copied": "Link copied",
    "vehicles": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Vehicles {'|'} Ambo Market",
        "description": "Buy {title} in {city} – cars, bikes, boats and more. Trusted listings only. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Vehicles {'|'} Ambo Market",
        "description": "Explore {title} for sale – cars, motorcycles, and commercial vehicles. {description}"
      }
    },
    "real-estate": {
      "city": {
        "title": "{title} in {city} {'|'} Real Estate {'|'} Ambo Market",
        "description": "Find {title} in {city} – houses, land, apartments and commercial property. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Real Estate {'|'} Ambo Market",
        "description": "View {title} for sale or rent – real estate listings across Angola. {description}"
      }
    },
    "electronics": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Electronics {'|'} Ambo Market",
        "description": "Looking for {title} in {city}? Browse phones, laptops, TVs and more on Ambo Market. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Electronics {'|'} Ambo Market",
        "description": "Buy {title} on Ambo Market – smartphones, gadgets, computers and more. {description}"
      }
    },
    "fashion": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Fashion {'|'} Ambo Market",
        "description": "Find {title} in {city} – stylish clothes, shoes, and accessories at great prices. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Fashion {'|'} Ambo Market",
        "description": "Buy {title} – discover fashion deals across Angola. Clothes, shoes, and more. {description}"
      }
    },
    "jobs": {
      "city": {
        "title": "{title} in {city} {'|'} Jobs {'|'} Ambo Market",
        "description": "Job opening: {title} in {city}. Apply now or explore other offers. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Jobs {'|'} Ambo Market",
        "description": "Job post: {title}. Find career opportunities across Angola. {description}"
      }
    },
    "services": {
      "city": {
        "title": "{title} in {city} {'|'} Services {'|'} Ambo Market",
        "description": "Find {title} in {city} – reliable personal or business services. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Services {'|'} Ambo Market",
        "description": "Service offered: {title}. Post or explore trusted services across Angola. {description}"
      }
    },
    "animals": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Animals {'|'} Ambo Market",
        "description": "Find {title} in {city} – pets, livestock, and supplies. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Animals {'|'} Ambo Market",
        "description": "{title} – pets, exotic animals, or farm livestock across Angola. {description}"
      }
    },
    "hobby": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Hobby & Leisure {'|'} Ambo Market",
        "description": "Find {title} in {city} – sports gear, musical instruments, games, collectibles and more. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Hobby & Leisure {'|'} Ambo Market",
        "description": "Buy {title} on Ambo Market – everything for your hobbies: games, music, sports, crafts and more. {description}"
      }
    },
    "kids": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Kids Items {'|'} Ambo Market",
        "description": "Looking for {title} in {city}? Find toys, clothes and baby items. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Kids Items {'|'} Ambo Market",
        "description": "Buy {title} – toys, clothing and more for kids across Angola. {description}"
      }
    },
    "home": {
      "city": {
        "title": "Buy {title} in {city} {'|'} Home & Garden {'|'} Ambo Market",
        "description": "Find {title} in {city} – furniture, appliances, décor and more. {description}"
      },
      "everywhere": {
        "title": "Buy {title} {'|'} Home & Garden {'|'} Ambo Market",
        "description": "Explore {title} for your home. Buy or sell furniture, tools and accessories. {description}"
      }
    }
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "location": "Localização",
    "category": "Categoria",
    "description": "Descrição do produto",
    "posted": "Publicado em",
    "share": "Compartilhar anúncio",
    "related_listings": "Anúncios Relacionados",
    "seller": "Vendedor",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "photos": "Fotos",
    "details": "Detalhes",
    "call_seller": "Ligar ao vendedor",
    "close_post": "Fechar anúncio",
    "no_photo": "Sem foto",
    "status_open": "Ativo",
    "status_hold": "Em espera",
    "status_closed": "Fechado",
    "status_archived": "Arquivado",
    "link_copied": "Link copiado",
    "vehicles": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Veículos {'|'} Ambo Market",
        "description": "Compre {title} em {city} – carros, motas, barcos e mais. Apenas anúncios verificados. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Veículos {'|'} Ambo Market",
        "description": "Explore {title} à venda – carros, motas e veículos comerciais. {description}"
      }
    },
    "real-estate": {
      "city": {
        "title": "{title} em {city} {'|'} Imóveis {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – casas, terrenos, apartamentos e imóveis comerciais. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Imóveis {'|'} Ambo Market",
        "description": "Veja {title} para venda ou aluguel – imóveis em toda Angola. {description}"
      }
    },
    "electronics": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "À procura de {title} em {city}? Veja telemóveis, computadores, TVs e mais. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "Compre {title} no Ambo Market – smartphones, gadgets, computadores e muito mais. {description}"
      }
    },
    "fashion": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Moda {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – roupas, calçados e acessórios com ótimos preços. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Moda {'|'} Ambo Market",
        "description": "Compre {title} – descubra ofertas de moda em toda Angola. {description}"
      }
    },
    "jobs": {
      "city": {
        "title": "{title} em {city} {'|'} Empregos {'|'} Ambo Market",
        "description": "Vaga de emprego: {title} em {city}. Candidate-se agora ou veja outras oportunidades. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Empregos {'|'} Ambo Market",
        "description": "Oferta de emprego: {title}. Encontre oportunidades de carreira em Angola. {description}"
      }
    },
    "services": {
      "city": {
        "title": "{title} em {city} {'|'} Serviços {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – serviços confiáveis para pessoas e empresas. {description}"
      },
      "everywhere": {
        "title": "{title} {'|'} Serviços {'|'} Ambo Market",
        "description": "Serviço oferecido: {title}. Publique ou encontre serviços de confiança em Angola. {description}"
      }
    },
    "animals": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Animais {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – animais de estimação, gado e acessórios. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Animais {'|'} Ambo Market",
        "description": "{title} – animais domésticos, exóticos ou de fazenda em toda Angola. {description}"
      }
    },
    "hobby": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Lazer & Passatempos {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – desporto, música, jogos, coleções e mais. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Lazer & Passatempos {'|'} Ambo Market",
        "description": "Compre {title} no Ambo Market – tudo para os seus passatempos: jogos, música, desporto e artesanato. {description}"
      }
    },
    "kids": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Artigos Infantis {'|'} Ambo Market",
        "description": "À procura de {title} em {city}? Encontre brinquedos, roupas e artigos para bebés. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Artigos Infantis {'|'} Ambo Market",
        "description": "Compre {title} – brinquedos, roupas e muito mais para crianças em toda Angola. {description}"
      }
    },
    "home": {
      "city": {
        "title": "Comprar {title} em {city} {'|'} Casa & Jardim {'|'} Ambo Market",
        "description": "Encontre {title} em {city} – móveis, eletrodomésticos, decoração e mais. {description}"
      },
      "everywhere": {
        "title": "Comprar {title} {'|'} Casa & Jardim {'|'} Ambo Market",
        "description": "Explore {title} para sua casa. Compre ou venda móveis, ferramentas e acessórios. {description}"
      }
    }
  }
}
</i18n>

<template>
  <div class="space-y-5 pb-24 pt-4 sm:py-6 lg:pb-6">
    <!-- Breadcrumbs -->
    <UBreadcrumb
      :items="breadcrumbItems"
      class="hidden sm:flex"
    />

    <section v-if="post && seller">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <!-- Left: gallery + info -->
        <div class="space-y-5">
          <!-- Gallery -->
          <div>
            <div class="relative overflow-hidden rounded-xl bg-muted">
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
                  <NuxtImg
                    :src="slide.url"
                    :alt="slide.alt"
                    class="h-full w-full object-cover"
                    sizes="sm:100vw md:720px lg:860px"
                    @click="selectImage(slide.index)"
                  />
                </div>
              </UCarousel>

              <div
                v-else
                class="aspect-square w-full overflow-hidden sm:aspect-[4/3]"
              >
                <NuxtImg
                  :src="fallbackImage"
                  :alt="post.title"
                  class="h-full w-full object-cover"
                />
              </div>

              <!-- Overlays -->
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
              class="mt-2 hidden gap-2 overflow-x-auto md:flex"
            >
              <button
                v-for="(thumb, i) in carouselSlides"
                :key="i"
                type="button"
                class="size-14 shrink-0 overflow-hidden rounded-lg border-2 transition"
                :class="activeImageIndex === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'"
                @click="selectImage(i)"
              >
                <NuxtImg
                  :src="thumb.url"
                  :alt="thumb.alt"
                  class="h-full w-full object-cover"
                  loading="lazy"
                  sizes="56px"
                />
              </button>
            </div>
          </div>

          <!-- Title + meta (mobile: shows here, before sidebar) -->
          <div class="lg:hidden">
            <h1
              class="text-2xl font-bold text-highlighted"
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
          <UCard v-if="post.description">
            <template #header>
              <p
                class="text-sm font-semibold text-highlighted"
                v-text="t('description')"
              />
            </template>

            <p
              class="whitespace-pre-line text-sm leading-relaxed text-toned"
              v-text="post.description"
            />
          </UCard>

          <!-- Details -->
          <UCard v-if="productDetails.length">
            <template #header>
              <p
                class="text-sm font-semibold text-highlighted"
                v-text="t('details')"
              />
            </template>

            <dl class="divide-y divide-default -mx-4 -my-3">
              <div
                v-for="item in productDetails"
                :key="item.label"
                class="flex items-center gap-3 px-4 py-2.5"
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
          </UCard>
        </div>

        <!-- Right: sticky contact card -->
        <aside class="space-y-4 lg:sticky lg:top-[74px] lg:self-start">
          <!-- Title + meta (desktop only) -->
          <div class="hidden lg:block">
            <h1
              class="text-2xl font-bold text-highlighted"
              v-text="post.title"
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
          <UCard>
            <div class="space-y-4">
              <p
                class="text-3xl font-bold text-highlighted"
                v-text="formattedPrice"
              />

              <USeparator />

              <UUser
                :name="seller.name"
                :description="sellerDescription"
                :avatar="sellerAvatar"
                size="lg"
              />

              <UButton
                v-if="hasControlButtons && isOwnerUser"
                :label="t('close_post')"
                icon="i-lucide-lock"
                color="neutral"
                variant="soft"
                block
                @click="isClosePostModalVisible = true"
              />

              <UButton
                v-else
                :label="t('call_seller')"
                :href="phoneLink"
                icon="i-lucide-phone"
                color="primary"
                block
                :disabled="!phoneLink || isPostUnavailable"
              />

              <USeparator :label="t('share')" />

              <div class="flex justify-center gap-2">
                <UButton
                  icon="i-simple-icons-whatsapp"
                  color="neutral"
                  variant="ghost"
                  :href="`https://wa.me/?text=${encodedShareText}`"
                  target="_blank"
                  aria-label="WhatsApp"
                />

                <UButton
                  icon="i-simple-icons-facebook"
                  color="neutral"
                  variant="ghost"
                  :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`"
                  target="_blank"
                  aria-label="Facebook"
                />

                <UButton
                  icon="i-lucide-link"
                  color="neutral"
                  variant="ghost"
                  aria-label="Copy link"
                  @click="copyShareLink"
                />
              </div>
            </div>
          </UCard>
        </aside>
      </div>

      <!-- Mobile sticky CTA -->
      <div
        class="fixed inset-x-0 bottom-0 z-20 border-t border-default bg-default/95 px-4 py-3 backdrop-blur-sm lg:hidden"
      >
        <div class="flex items-center gap-3">
          <p
            class="text-lg font-bold text-highlighted"
            v-text="formattedPrice"
          />

          <UButton
            v-if="hasControlButtons && isOwnerUser"
            :label="t('close_post')"
            icon="i-lucide-lock"
            color="neutral"
            variant="soft"
            class="ml-auto"
            @click="isClosePostModalVisible = true"
          />

          <UButton
            v-else
            :label="t('call_seller')"
            :href="phoneLink"
            icon="i-lucide-phone"
            color="primary"
            class="ml-auto flex-1"
            :disabled="!phoneLink || isPostUnavailable"
          />

          <UButton
            icon="i-simple-icons-whatsapp"
            color="neutral"
            variant="soft"
            :href="`https://wa.me/?text=${encodedShareText}`"
            target="_blank"
            aria-label="WhatsApp"
          />
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
        class="mb-4 text-lg font-semibold text-highlighted"
        v-text="t('related_listings')"
      />

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NuxtLink
          v-for="recommendedPost in recommendedPostsList"
          :key="recommendedPost.id"
          :to="getRecommendedPostTo(recommendedPost)"
          class="group overflow-hidden rounded-xl border border-default bg-default transition hover:border-primary/40 hover:shadow-sm"
        >
          <div class="relative aspect-square overflow-hidden bg-muted">
            <NuxtImg
              v-if="recommendedPost.preview"
              :src="recommendedPost.preview"
              :alt="recommendedPost.title"
              class="size-full object-cover transition group-hover:scale-105"
              loading="lazy"
              sizes="sm:50vw lg:220px"
            />

            <UEmpty
              v-else
              icon="i-lucide-image-off"
              :title="t('no_photo')"
              class="h-full"
            />
          </div>

          <div class="space-y-1 p-3">
            <p
              class="truncate text-sm font-semibold text-highlighted"
              v-text="formatCurrency(recommendedPost.price)"
            />

            <p
              class="line-clamp-2 min-h-10 text-sm text-toned"
              v-text="recommendedPost.title"
            />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- SEO text -->
    <UCard v-if="post">
      <SeoProductText
        :productTitle="post.title"
        :category="postCategoryName"
        :price="formattedPrice"
        :city="postCityName"
        :seller="seller?.name"
        :productList="[]"
      />
    </UCard>
  </div>
</template>
