<script setup lang="ts">
import IconLocation from '~/assets/images/header/icon-location.svg?component';
import formatCurrency from '~/utils/formatCurrency';
import { CURRENCY } from '~/constants/currency';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { ProductApiResponse, User } from '~/types/product';
import { formatFullDate } from '~/utils/formatDate';
import { useUser } from '~/composables/useUser';


const { $fire } = useNuxtApp();
const route = useRoute();

const postId = computed(() => `${route.params.productId}`);

const { data: product, error } = await useAsyncData<ProductApiResponse>(async () => {
  try {
    const response = await $fire.https('getPostById', { postId: postId.value });

    const { post, user } = response as ProductApiResponse;

    const postCityId = getCityIdByName(post?.location?.city);
    const postCategoryId = post?.categoryId;

    if (postCityId !== route.params.cityId || postCategoryId !== route.params.categoryId) {
      navigateTo({
        name: 'cityId-categoryId-productId',
        params: {
          productId: post?.id,
          categoryId: postCategoryId,
          cityId: postCityId,
        },
      }, { redirectCode: 301 });
    }

    return {
      post,
      user,
    };
  } catch (error) {
    if (error?.code === 'functions/not-found') {
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
});

if (error && error?.value) {
  throw createError(error?.value);
}


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

const postCategoryName = computed(() => t(`${post.value?.categoryId}`));

const postLocation = computed(() => post.value?.location);
const postCityId = computed(() => getCityIdByName(postLocation.value?.city ?? ''));
const postCityName = computed(() => postLocation.value?.displayName);

const formattedPrice = computed(() => formatCurrency(`${post.value?.price}`));
const formattedDate = computed(() => post.value?.createdAt ? formatFullDate(post.value?.createdAt, locale.value) : '');

const seo = computed(() => {
  const categoryId = post.value?.categoryId;
  const translationKey = postCityId.value && postCityName.value ? 'withCity' : 'withoutCity';

  const title = t(`${categoryId}.${translationKey}.title`, {
    title: post.value?.title,
    city: postCityName.value,
  });

  const description = t(`${categoryId}.${translationKey}.description`, {
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
      priceCurrency: CURRENCY,
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

const breadcrumbsList = computed(() => [
  {
    title: 'Main',
    to: {
      name: 'cityId',
      params: {
        cityId: postCityId.value,
      },
    },
  },
  {
    title: postCategoryName.value,
    to: {
      name: 'cityId-categoryId',
      params: {
        categoryId: post.value?.categoryId,
        cityId: postCityId.value,
      },
    },
  },
  { title: `${post.value?.title}` },
]);

const { uid, isLoggedIn } = useUser();

const isOwnerUser = computed(() => uid.value === seller.value?.id);
const hasControlButtons = computed(() => post.value?.status === POST_STATUSES.OPEN);


const isNumberLoading = ref(false);
const isShowNumberModalVisible = ref(false);

const showShowNumberModal = () => {
  isShowNumberModalVisible.value = true;
};

const hideShowNumberModal = () => {
  isShowNumberModalVisible.value = false;
};

const getPhoneNumber = async () => {
  if (isLoggedIn.value) {
    try {
      isNumberLoading.value = true;

      const user = await $fire.https('getPostUserData', { userId: seller.value?.id });

      seller.value = user as User;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      isNumberLoading.value = false;
    }
  } else {
    await navigateTo(`/auth?redirect=${route.path}`);
  }
};

const showNumber = () => {
  showShowNumberModal();
  getPhoneNumber();
};


const createOrder = () => {
  navigateTo({
    name: 'product-productId-buy',
    params: { productId: postId.value },
  });
};


const isChatLoading = ref(false);

const createChatRoom = async () => {
  if (isLoggedIn.value) {
    try {
      isChatLoading.value = true;

      const chat = await $fire.https('createChat', {
        senderId: uid.value,
        receiverId: seller.value?.id,
        postId: postId.value,
      });

      if (chat && chat.chatId) {
        await navigateTo({
          name: 'im-chat-chatId',
          params: { chatId: chat.chatId },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      isChatLoading.value = false;
    }
  } else {
    await navigateTo(`/auth?redirect=${route.path}`);
  }
};


const isClosePostModalVisible = ref(false);

const showClosePostModal = () => {
  isClosePostModalVisible.value = true;
};

const hideClosePostModal = () => {
  isClosePostModalVisible.value = false;
};


const currentSlideIndex = ref(0);
const isGalleryModalVisible = ref(false);

const showGalleryModal = (index: number) => {
  currentSlideIndex.value = index;
  isGalleryModalVisible.value = true;
};

const hideGalleryModal = () => {
  isGalleryModalVisible.value = false;
};


const isMapModalVisible = ref(false);

const showMapModal = () => {
  isMapModalVisible.value = true;
};

const hideMapModal = () => {
  isMapModalVisible.value = false;
};

const { isDesktopOrTablet } = useDevice();
</script>

<i18n lang="json">
{
  "en": {
    "contact_seller": "Contact the Seller",
    "show_on_map": "View Location on Map",
    "location": "Location",
    "category": "Category",
    "description": "Description",
    "posted": "Posted On",
    "share": "Share Listing",
    "electronics": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Electronics {'|'} Ambo Market",
        "description": "Buy {title} in {city} on Ambo Market. Phones, laptops, TVs and more at great prices. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Electronics {'|'} Ambo Market",
        "description": "Buy {title} on Ambo Market. Discover phones, laptops, TVs and more. {description}"
      }
    },
    "clothing": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Fashion {'|'} Ambo Market",
        "description": "Buy {title} in {city} – explore clothes, shoes, and accessories. Great deals on Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Fashion {'|'} Ambo Market",
        "description": "Buy {title} – clothes, shoes and accessories available across Angola. {description}"
      }
    },
    "transport": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Vehicles {'|'} Ambo Market",
        "description": "Buy {title} in {city} – explore cars, motorcycles, and more. Verified listings only. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Vehicles {'|'} Ambo Market",
        "description": "Buy {title} – cars, motorcycles, and other transport options. {description}"
      }
    },
    "auto-parts": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Auto Parts {'|'} Ambo Market",
        "description": "Buy {title} – car parts in {city}: tires, batteries, engines and accessories. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Auto Parts {'|'} Ambo Market",
        "description": "Buy {title} – auto parts like tires, engines, and batteries. {description}"
      }
    },
    "beauty-health": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Beauty & Health {'|'} Ambo Market",
        "description": "Shop {title} in {city}. Find cosmetics, wellness and health items online. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Beauty & Health {'|'} Ambo Market",
        "description": "Buy {title} – cosmetics, wellness and personal care deals. {description}"
      }
    },
    "real-estate": {
      "withCity": {
        "title": "{title} in {city} {'|'} Real Estate {'|'} Ambo Market",
        "description": "View {title} – real estate in {city}. Homes, apartments and land for sale or rent. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Real Estate {'|'} Ambo Market",
        "description": "Real estate listing: {title}. Homes, apartments and property offers. {description}"
      }
    },
    "childrens-goods": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Kids Items {'|'} Ambo Market",
        "description": "Buy {title} in {city}. Find toys, clothing and products for children. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Kids Items {'|'} Ambo Market",
        "description": "Buy {title} – children's toys, clothes, and more. {description}"
      }
    },
    "job": {
      "withCity": {
        "title": "{title} in {city} {'|'} Job Listings {'|'} Ambo Market",
        "description": "{title} – Job opening in {city}. Find career opportunities and apply easily. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Job Listings {'|'} Ambo Market",
        "description": "Job post: {title}. Browse job offers and find your next role. {description}"
      }
    },
    "services": {
      "withCity": {
        "title": "{title} in {city} {'|'} Services {'|'} Ambo Market",
        "description": "Find {title} in {city}. Explore reliable personal and business services. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Services {'|'} Ambo Market",
        "description": "Service offered: {title}. Browse and hire trusted services. {description}"
      }
    },
    "building-materials": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Construction Materials {'|'} Ambo Market",
        "description": "Find {title} in {city} – cement, bricks, tools and supplies. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Construction Materials {'|'} Ambo Market",
        "description": "Buy {title} – tools and materials for building and renovation. {description}"
      }
    },
    "animals": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Animals {'|'} Ambo Market",
        "description": "{title} – animals in {city} for sale or adoption. Pets, livestock and supplies. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Animals {'|'} Ambo Market",
        "description": "{title} – pets, livestock and animal supplies for sale. {description}"
      }
    },
    "for-business": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Business Supplies {'|'} Ambo Market",
        "description": "Buy {title} – business products in {city}. Office, retail and industrial equipment. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Business Supplies {'|'} Ambo Market",
        "description": "Business tools: {title}. Office gear, equipment, and B2B products. {description}"
      }
    },
    "for-home": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Home & Garden {'|'} Ambo Market",
        "description": "Buy {title} for your home in {city}. Furniture, appliances and home decor. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Home & Garden {'|'} Ambo Market",
        "description": "Home item for sale: {title}. Appliances, decor, and furniture deals. {description}"
      }
    },
    "other": {
      "withCity": {
        "title": "Buy {title} in {city} {'|'} Other {'|'} Ambo Market",
        "description": "{title} for sale in {city}. Explore rare and unique items. {description}"
      },
      "withoutCity": {
        "title": "Buy {title} {'|'} Other {'|'} Ambo Market",
        "description": "{title} for sale. Discover unusual offers and collectibles. {description}"
      }
    }
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "show_on_map": "Mostrar no mapa",
    "location": "Localização",
    "category": "Categoria",
    "description": "Descrição do produto",
    "posted": "Publicado em",
    "share": "Compartilhar anúncio",
    "electronics": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "Anúncio de {title} em {city}. Celulares, laptops, TVs e outros eletrônicos com ótimos preços. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "Anúncio de {title}. Encontre celulares, notebooks, TVs e mais. {description}"
      }
    },
    "clothing": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Moda {'|'} Ambo Market",
        "description": "Compre {title} em {city}. Roupas, sapatos e acessórios masculinos, femininos e infantis. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Moda {'|'} Ambo Market",
        "description": "Anúncio de {title}. Moda para todas as idades: roupas, calçados e acessórios. {description}"
      }
    },
    "transport": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Transporte {'|'} Ambo Market",
        "description": "Venda de {title} em {city}. Carros, motos e outros veículos à venda. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Transporte {'|'} Ambo Market",
        "description": "Encontre {title} – carros, motos e mais. Negocie com segurança. {description}"
      }
    },
    "auto-parts": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Peças de automóveis {'|'} Ambo Market",
        "description": "Venda de {title} em {city}. Motores, pneus, baterias e acessórios. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Peças de automóveis {'|'} Ambo Market",
        "description": "Anúncio de {title}. Peças novas e usadas: pneus, motores, acessórios. {description}"
      }
    },
    "beauty-health": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Beleza e Saúde {'|'} Ambo Market",
        "description": "Produto {title} em {city}. Cosméticos, cuidados pessoais e equipamentos de saúde. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Beleza e Saúde {'|'} Ambo Market",
        "description": "Anúncio de {title}. Itens de beleza, bem-estar e cuidados com a saúde. {description}"
      }
    },
    "real-estate": {
      "withCity": {
        "title": "{title} para comprar ou alugar em {city} {'|'} Imóveis {'|'} Ambo Market",
        "description": "{title} disponível em {city}. Casas, apartamentos, terrenos e mais. {description}"
      },
      "withoutCity": {
        "title": "{title} para comprar ou alugar {'|'} Imóveis {'|'} Ambo Market",
        "description": "Imóvel: {title}. Encontre opções para comprar ou alugar. {description}"
      }
    },
    "childrens-goods": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Produtos Infantis {'|'} Ambo Market",
        "description": "Anúncio de {title} em {city}. Brinquedos, roupas e artigos infantis com ótimos preços. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Produtos Infantis {'|'} Ambo Market",
        "description": "Venda de {title}. Brinquedos, roupas e acessórios para crianças. {description}"
      }
    },
    "job": {
      "withCity": {
        "title": "{title} em {city} {'|'} Empregos {'|'} Ambo Market",
        "description": "Oferta de emprego: {title} em {city}. Veja vagas disponíveis e candidate-se. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Empregos {'|'} Ambo Market",
        "description": "Vaga de emprego: {title}. Encontre oportunidades em diversos setores. {description}"
      }
    },
    "services": {
      "withCity": {
        "title": "{title} em {city} {'|'} Serviços {'|'} Ambo Market",
        "description": "Serviço: {title} em {city}. Contrate serviços profissionais e particulares. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Serviços {'|'} Ambo Market",
        "description": "Serviço anunciado: {title}. Veja opções de serviços em Angola. {description}"
      }
    },
    "building-materials": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Materiais de Construção {'|'} Ambo Market",
        "description": "Anúncio de {title} em {city}. Cimento, tijolos, ferramentas e mais para sua obra. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Materiais de Construção {'|'} Ambo Market",
        "description": "Venda de {title}. Encontre tudo para construção e reforma. {description}"
      }
    },
    "animals": {
      "withCity": {
        "title": "{title} para compra ou adoção em {city} {'|'} Animais {'|'} Ambo Market",
        "description": "{title} disponível em {city}. Pets, gado e animais exóticos. {description}"
      },
      "withoutCity": {
        "title": "{title} para compra ou adoção {'|'} Animais {'|'} Ambo Market",
        "description": "Anúncio de {title}. Encontre animais domésticos e de criação. {description}"
      }
    },
    "for-business": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Para Negócios {'|'} Ambo Market",
        "description": "Venda de {title} em {city}. Equipamentos, máquinas e suprimentos para empresas. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Para Negócios {'|'} Ambo Market",
        "description": "Produto empresarial: {title}. Encontre itens para sua empresa. {description}"
      }
    },
    "for-home": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Para Casa {'|'} Ambo Market",
        "description": "Anúncio de {title} para casa em {city}. Móveis, eletrodomésticos e decoração. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Para Casa {'|'} Ambo Market",
        "description": "{title} à venda. Produtos para o lar com ótimos preços. {description}"
      }
    },
    "other": {
      "withCity": {
        "title": "Comprar {title} em {city} {'|'} Outros {'|'} Ambo Market",
        "description": "Anúncio de {title} em {city}. Itens raros, exclusivos e diferenciados. {description}"
      },
      "withoutCity": {
        "title": "Comprar {title} {'|'} Outros {'|'} Ambo Market",
        "description": "{title} à venda. Produtos únicos e colecionáveis no Ambo Market. {description}"
      }
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <UIBreadcrumbs
      v-if="isDesktopOrTablet"
      :items="breadcrumbsList"
      :class="$style.breadcrumbs"
    />

    <section
      v-if="post && seller"
      :class="$style.product"
    >
      <div :class="$style.main">
        <div :class="$style.header">
          <div :class="$style.headerContent">
            <div
              :class="$style.mobilePrice"
              v-text="formattedPrice"
            />

            <h1
              :class="$style.headerTitle"
              v-text="post.title"
            />
          </div>

          <div :class="$style.favoriteBlock">
            <ProductFavoriteButton
              :postId="postId"
              :hasText="isDesktopOrTablet"
            />
          </div>
        </div>

        <GalleryRoot
          :images="post.images"
          :status="post.status"
          :class="$style.gallery"
          @open-modal="showGalleryModal"
        />

        <transition name="fade">
          <LazyGalleryModal
            v-if="isGalleryModalVisible"
            :post="post"
            :seller="seller"
            :currentIndex="currentSlideIndex"
            :phoneNumber="seller.phone"
            :isSafeDeal="post.isSafeDeal"
            :isOwner="isOwnerUser"
            :isNumberLoading="isNumberLoading"
            :isChatLoading="isChatLoading"
            @close-post="showClosePostModal"
            @show-number="showNumber"
            @create-chat-room="createChatRoom"
            @close="hideGalleryModal"
          />
        </transition>

        <ProductControls
          v-if="hasControlButtons"
          :phoneNumber="seller.phone"
          :isSafeDeal="post.isSafeDeal"
          :isOwner="isOwnerUser"
          :isNumberLoading="isNumberLoading"
          :isChatLoading="isChatLoading"
          :class="[$style.contacts, $style.hideOnDesktop]"
          @close-post="showClosePostModal"
          @show-number="showNumber"
          @create-chat-room="createChatRoom"
          @create-order="createOrder"
        />

        <ul>
          <li
            v-if="postLocation"
            :class="$style.descriptionItem"
          >
            <UILineDescription
              :title="t('location')"
              position="center"
              hideTitle
            >
              <div :class="$style.location">
                <div :class="$style.locationAddress">
                  <IconLocation :class="$style.locationIcon" />

                  <span
                    :class="$style.locationName"
                    v-text="postCityName"
                  />
                </div>

                <UIButton
                  v-if="postLocation"
                  :text="t('show_on_map')"
                  :class="$style.locationMapButton"
                  type="secondary"
                  @click="showMapModal"
                />
              </div>
            </UILineDescription>
          </li>

          <li :class="$style.descriptionItem">
            <UILineDescription :title="t('description')">
              <p
                :class="$style.productDescription"
                v-text="post.description"
              />
            </UILineDescription>
          </li>

          <li :class="$style.descriptionItem">
            <UILineDescription
              :title="t('category')"
              :description="postCategoryName"
              position="center"
            />
          </li>

          <li :class="$style.descriptionItem">
            <UILineDescription
              :title="t('posted')"
              :description="formattedDate"
              position="center"
            />
          </li>

          <li :class="$style.descriptionItem">
            <UILineDescription :title="t('share')">
              <ProductSharingButtons
                :title="post.title"
                :link="route.fullPath"
              />
            </UILineDescription>
          </li>
        </ul>

        <UserInfo
          v-if="!isDesktopOrTablet"
          :user="seller"
          :class="[$style.profileInfoMobile, $style.hideOnDesktop]"
        />
      </div>

      <div :class="$style.rightColumn">
        <div :class="$style.rails">
          <span
            :class="$style.price"
            v-text="formattedPrice"
          />

          <ProductControls
            v-if="hasControlButtons"
            :phoneNumber="seller.phone"
            :isOwner="isOwnerUser"
            :isSafeDeal="post.isSafeDeal"
            :isNumberLoading="isNumberLoading"
            :isChatLoading="isChatLoading"
            :class="$style.contacts"
            @close-post="showClosePostModal"
            @show-number="showNumber"
            @create-chat-room="createChatRoom"
            @create-order="createOrder"
          />

          <UserInfo
            :user="seller"
            :class="$style.profileInfo"
          />

          <AD
            v-if="false"
            :class="$style.ad"
            type="vertical"
          />
        </div>
      </div>

      <LazyGeolocationPreviewModal
        v-if="isMapModalVisible && postLocation"
        :displayName="postLocation.displayName"
        :latitude="postLocation.lat"
        :longitude="postLocation.lon"
        @close="hideMapModal"
      />

      <transition name="fade">
        <LazyProductBuyersModal
          v-if="isClosePostModalVisible"
          :postId="postId"
          @close="hideClosePostModal"
        />
      </transition>

      <transition name="fade">
        <LazyProductShowNumberModal
          v-if="isShowNumberModalVisible"
          :isLoading="isNumberLoading"
          :user="seller"
          @show-number="getPhoneNumber"
          @close="hideShowNumberModal"
        />
      </transition>
    </section>

    <UITextRoll :class="$style.text">
      <SeoProductText
        :productTitle="post?.title"
        :category="postCategoryName"
        :price="formattedPrice"
        :city="postCityName"
        :seller="seller?.name"
        :productList="[]"
      />
    </UITextRoll>

    <AD
      v-if="false"
      :class="$style.ad"
      isMobile
      type="horizontal"
    />
  </div>
</template>


<style lang="scss" module>
.hideOnDesktop {

  @include exclude-md {
    display: none !important;
  }
}

.root {
  @include ui-simple-container;

  padding: 10px 20px;
}

.breadcrumbs {

  @include md {
    display: none;
  }
}

.product {
  display: flex;

  @include exclude-md {
    @include ui-round-content-blocks;

    margin-top: 10px;
    padding: 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.main {
  display: flex;
  flex-direction: column;

  @include md {
    width: 100%;
  }

  @include exclude-md {
    width: 75%;
    padding-right: 20px;
  }
}

.header {
  display: flex;
  flex-direction: row;

  @include md {
    margin-top: 20px;
  }
}

.headerContent {
  flex-grow: 1;
}

.mobilePrice {
  @include ui-typo-24-bold;

  margin-bottom: 8px;

  @include exclude-md {
    display: none;
  }
}

.headerTitle {
  overflow-wrap: anywhere;

  @include md {
    @include ui-typo-20-medium;
  }

  @include exclude-md {
    @include ui-typo-32-medium;
  }
}

.favoriteBlock {

  @include exclude-md {
    display: flex;
    align-items: center;
  }
}

.gallery {

  @include md {
    $fix-mobile-padding: -20px;

    order: -1;
    margin-right: $fix-mobile-padding;
    margin-left: $fix-mobile-padding;
  }

  @include exclude-md {
    margin-top: 20px;
  }
}

.price {
  @include ui-typo-32-bold;
}

.descriptionItem {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.productDescription {
  white-space: break-spaces;
}

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.locationAddress {
  display: flex;
  align-items: center;
  width: calc(100% - 140px);
  margin-right: 10px;
}

.locationIcon {
  flex-shrink: 0;
  margin-right: 10px;

  @include exclude-md {
    display: none;
  }
}

.locationName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.locationMapButton {
  flex-shrink: 0;
}

.profileInfoMobile {
  margin-top: 20px;
}

.ad {
  margin-top: 20px;
}

.rightColumn {
  width: 25%;
  min-width: 0;
  margin: 0;

  @include md {
    display: none;
  }
}

.rails {
  position: sticky;
  top: (64px + 10px);
}

.contacts {
  margin-top: 20px;
}

.profileInfo {
  margin-top: 20px;
}

.text {
  padding-top: 20px;
}
</style>
