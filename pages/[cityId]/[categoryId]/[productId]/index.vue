<script setup lang="ts">
import IconLocation from '~/assets/images/header/icon-location.svg?component';
import formatCurrency from '~/utils/formatCurrency';
import { CURRENCY } from '~/constants/currency';
import { getCityIdByName } from '~/constants/cities';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { ProductApiResponse, User } from '~/types/product';
import formatLocalizedDate from '~/utils/formatLocalizedDate';
import { useUser } from '~/composables/useUser';


const { $fire } = useNuxtApp();
const route = useRoute();

const postId = computed(() => `${route.params.productId}`);

const { data: product, error } = await useAsyncData<ProductApiResponse>(async () => {
  try {
    const response = await $fire.https('getPostById', { postId: postId.value });

    const { post, user } = response as ProductApiResponse;

    const postCityId = getCityIdByName(post?.location?.city);

    if (postCityId !== route.params.cityId) {
      navigateTo({
        name: 'cityId-categoryId-productId',
        params: {
          productId: post?.id,
          categoryId: post?.categoryId,
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
const formattedDate = computed(() => post.value?.createdAt ? formatLocalizedDate(post.value?.createdAt, locale.value) : '');

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

useHead({
  title: computed(() => seo.value.title),
  meta: computed(() => [
    { key: 'og:title', property: 'og:title', content: seo.value.title },
    { key: 'og:description', property: 'og:description', content: seo.value.description },
    { hid: 'og:image', property: 'og:image', content: seo.value.image },

    { key: 'description', name: 'description', content: seo.value.description },

    { hid: 'twitter:image', property: 'twitter:image', content: seo.value.image },
    { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
    { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
  ]),
  script: computed(() => [{
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
  }]),
});

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
    "contact_seller": "Contact seller",
    "show_on_map": "Show on map",
    "location": "Location",
    "category": "Category",
    "description": "Description",
    "posted": "Posted",
    "share": "Share",

    "electronics": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Electronics {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Discover electronics like phones, laptops, TVs, and more. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Electronics {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Discover electronics like phones, laptops, TVs, and more. {description}"
      }
    },
    "clothing": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Clothing {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Explore fashion items including clothing, shoes, and accessories. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Clothing {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Explore fashion items including clothing, shoes, and accessories. {description}"
      }
    },
    "transport": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Transport {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Find cars, motorcycles, and other vehicles at great prices. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Transport {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Find cars, motorcycles, and other vehicles at great prices. {description}"
      }
    },
    "auto-parts": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Auto Parts {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Buy car parts including engines, tires, and accessories. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Auto Parts {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Buy car parts including engines, tires, and accessories. {description}"
      }
    },
    "beauty-health": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Beauty & Health {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Discover cosmetics, personal care products, and health equipment. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Beauty & Health {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Discover cosmetics, personal care products, and health equipment. {description}"
      }
    },
    "real-estate": {
      "withCity": {
        "title": "{title} for rent/sale in {city} {'|'} Real Estate {'|'} Ambo Market",
        "description": "{title}: real estate in {city} on Ambo Market. Find apartments, houses, or commercial properties. {description}"
      },
      "withoutCity": {
        "title": "{title} for rent/sale {'|'} Real Estate {'|'} Ambo Market",
        "description": "{title}: real estate on Ambo Market. Find apartments, houses, or commercial properties. {description}"
      }
    },
    "childrens-goods": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Children's Goods {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Explore toys, clothing, and accessories for children. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Children's Goods {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Explore toys, clothing, and accessories for children. {description}"
      }
    },
    "job": {
      "withCity": {
        "title": "{title} in {city} {'|'} Jobs {'|'} Ambo Market",
        "description": "{title}: job listing in {city} on Ambo Market. Find your next career opportunity today. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Jobs {'|'} Ambo Market",
        "description": "{title}: job listing on Ambo Market. Find your next career opportunity today. {description}"
      }
    },
    "services": {
      "withCity": {
        "title": "{title} in {city} {'|'} Services {'|'} Ambo Market",
        "description": "{title}: service in {city} on Ambo Market. Discover professional and personal services near you. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Services {'|'} Ambo Market",
        "description": "{title}: service on Ambo Market. Discover professional and personal services near you. {description}"
      }
    },
    "building-materials": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Building Materials {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Find construction materials, tools, and supplies. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Building Materials {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Find construction materials, tools, and supplies. {description}"
      }
    },
    "animals": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Animals {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Buy pets, livestock, and animal supplies. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Animals {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Buy pets, livestock, and animal supplies. {description}"
      }
    },
    "for-business": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Business Supplies {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Discover office equipment, machinery, and business tools. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Business Supplies {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Discover office equipment, machinery, and business tools. {description}"
      }
    },
    "for-home": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Home & Garden {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Find furniture, appliances, and decor for your home. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Home & Garden {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Find furniture, appliances, and decor for your home. {description}"
      }
    },
    "other": {
      "withCity": {
        "title": "{title} for sale in {city} {'|'} Other {'|'} Ambo Market",
        "description": "{title}: for sale in {city} on Ambo Market. Explore various items and deals. {description}"
      },
      "withoutCity": {
        "title": "{title} for sale {'|'} Other {'|'} Ambo Market",
        "description": "{title}: for sale on Ambo Market. Explore various items and deals. {description}"
      }
    }
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "show_on_map": "Mostrar no mapa",
    "location": "Localização",
    "category": "Categoria",
    "description": "Descrição",
    "posted": "Postou",
    "share": "Compartilhar",

    "electronics": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Eletrônicos {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "clothing": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Roupas e acessórios {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Roupas e acessórios {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "transport": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Transporte {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Transporte {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "auto-parts": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Peças de automóveis {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Peças de automóveis {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "beauty-health": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Beleza e saúde {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Beleza e saúde {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "real-estate": {
      "withCity": {
        "title": "{title} comprar ou alugar em {city} {'|'} Imóveis {'|'} Ambo Market",
        "description": "{title}: imóvel em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar ou alugar {'|'} Imóveis {'|'} Ambo Market",
        "description": "{title}: imóvel no Ambo Market. {description}"
      }
    },
    "childrens-goods": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Produtos infantis {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Produtos infantis {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "job": {
      "withCity": {
        "title": "{title} em {city} {'|'} Empregos {'|'} Ambo Market",
        "description": "{title}: oferta de emprego em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Empregos {'|'} Ambo Market",
        "description": "{title}: oferta de emprego no Ambo Market. {description}"
      }
    },
    "services": {
      "withCity": {
        "title": "{title} em {city} {'|'} Serviços {'|'} Ambo Market",
        "description": "{title}: serviço em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} {'|'} Serviços {'|'} Ambo Market",
        "description": "{title}: serviço no Ambo Market. {description}"
      }
    },
    "building-materials": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Materiais de construção {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Materiais de construção {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "animals": {
      "withCity": {
        "title": "{title} comprar ou adotar em {city} {'|'} Animais {'|'} Ambo Market",
        "description": "{title}: venda ou adoção em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar ou adotar {'|'} Animais {'|'} Ambo Market",
        "description": "{title}: venda ou adoção no Ambo Market. {description}"
      }
    },
    "for-business": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Para negócios {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Para negócios {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "for-home": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Para casa {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Para casa {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
      }
    },
    "other": {
      "withCity": {
        "title": "{title} comprar em {city} {'|'} Outros {'|'} Ambo Market",
        "description": "{title}: venda em {city} no Ambo Market. {description}"
      },
      "withoutCity": {
        "title": "{title} comprar {'|'} Outros {'|'} Ambo Market",
        "description": "{title}: venda no Ambo Market. {description}"
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

            <h2
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

    <AD
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

  padding: 0 20px 20px 20px;
}

.breadcrumbs {
  margin-top: 10px;

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
  @include ui-typo-36-bold;

  margin-bottom: 10px;

  @include exclude-md {
    display: none;
  }
}

.headerTitle {
  overflow-wrap: anywhere;

  @include md {
    @include ui-typo-24-medium;
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
</style>
