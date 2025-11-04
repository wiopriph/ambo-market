<script setup lang="ts">
import IconLocation from '~/assets/images/header/icon-location.svg?component';
import formatCurrency from '~/utils/formatCurrency';
import { CURRENCY } from '~/constants/currency';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { ProductApiResponse, User } from '~/types/product';
import { formatFullDate } from '~/utils/formatDate';
import { useUser } from '~/composables/useUser';
import { getPostRoute } from '~/utils/getPostRoute';
import { AUTH_ACTIONS } from '~/constants/auth-actions';
import { CLICK_AD_PHOTO, CLICK_BUY, CLICK_CALL, CLICK_CHAT, CLICK_SHOW_ON_MAP } from '~/constants/analytics-events';


definePageMeta({
  path: '/:cityId/:categoryId/:subcategoryId/:productId([A-Za-z0-9_-]{20}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
});

const { pushEvent } = useAnalyticsEvent();

const { $fire } = useNuxtApp();
const route = useRoute();

const postId = computed(() => `${route.params.productId}`);

const { data: product, error } = await useAsyncData<ProductApiResponse>(
  () => `post-${route.params.productId}`,
  async () => {
    try {
      const response = await $fetch<{ post: any; user: any }>(`/api/posts/${postId.value}`);

      const { post, user } = response as ProductApiResponse;

      const postCityId = getCityIdByName(post?.location?.city);

      if (postCityId !== route.params.cityId ||
        post?.categoryId !== route.params.categoryId ||
        (post?.subcategoryId && (post?.subcategoryId !== route.params.subcategoryId))) {
        const route = getPostRoute({
          productId: post?.id,
          brandId: post?.brandId,
          subcategoryId: post?.subcategoryId,
          categoryId: post?.categoryId,
          cityId: postCityId,
        });


        navigateTo(route, { redirectCode: 301 });
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
  },
);

if (error && error?.value) {
  throw createError(error?.value);
}

const { data: recommendedPosts } = await useAsyncData(
  () => `recommendedPosts-${route.params.productId}`,
  async () => {
    const response = await $fetch<{ posts: [] }>(`/api/posts/${postId.value}/recommended`, { params: { limit: 4 } });

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

const postLocation = computed(() => post.value?.location);
const postCityId = computed(() => getCityIdByName(postLocation.value?.city ?? ''));
const postCityName = computed(() => postLocation.value?.displayName);

const formattedPrice = computed(() => formatCurrency(`${post.value?.price}`));
const formattedDate = computed(() => post.value?.createdAt ? formatFullDate(post.value?.createdAt, locale.value) : '');

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
        categoryId: categoryId.value,
        cityId: postCityId.value,
      },
    },
  },
  {
    title: postSubcategoryName.value,
    to: {
      name: 'cityId-categoryId-subcategoryId',
      params: {
        categoryId: categoryId.value,
        subcategoryId: subcategoryId.value,
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
    await navigateTo({
      name: 'auth',
      query: {
        action: AUTH_ACTIONS.CALL,
        redirect: route.path,
      },
    });
  }
};

const showNumber = () => {
  pushEvent(CLICK_CALL, { product_id: postId.value });

  getPhoneNumber();
  showShowNumberModal();
};


const createOrder = () => {
  pushEvent(CLICK_BUY, { product_id: postId.value });

  navigateTo({
    name: 'product-productId-buy',
    params: { productId: postId.value },
  });
};


const isChatLoading = ref(false);

const createChatRoom = async () => {
  pushEvent(CLICK_CHAT, { product_id: postId.value });

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
    await navigateTo({
      name: 'auth',
      query: {
        action: AUTH_ACTIONS.CHAT,
        redirect: route.path,
      },
    });
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
  pushEvent(CLICK_AD_PHOTO, { product_id: postId.value });

  currentSlideIndex.value = index;
  isGalleryModalVisible.value = true;
};

const hideGalleryModal = () => {
  isGalleryModalVisible.value = false;
};


const isMapModalVisible = ref(false);

const showMapModal = () => {
  pushEvent(CLICK_SHOW_ON_MAP, { product_id: postId.value });

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
    "related_listings": "Related Listings",
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
    "show_on_map": "Mostrar no mapa",
    "location": "Localização",
    "category": "Categoria",
    "description": "Descrição do produto",
    "posted": "Publicado em",
    "share": "Compartilhar anúncio",
    "related_listings": "Anúncios Relacionados",
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

    <section
      v-if="recommendedPosts?.length"
      :class="$style.block"
    >
      <h3
        :class="$style.listingTitle"
        v-text="t('related_listings')"
      />

      <ProductList :list="recommendedPosts" />
    </section>

    <UITextRoll :class="$style.block">
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

.block {
  margin-top: 20px;
}

.listingTitle {
  @include ui-typo-24-bold;

  margin-bottom: 20px;
}
</style>
