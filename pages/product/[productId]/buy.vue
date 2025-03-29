<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency';
import { POST_STATUSES } from '~/constants/post-statuses';
import type { ProductApiResponse } from '~/types/product';


definePageMeta({
  middleware: 'auth',
});

const { $fire } = useNuxtApp();
const route = useRoute();

const { data: product, error } = await useAsyncData(async () => {
  try {
    const response = await $fire.https('getPostById', { postId: route.params.productId });

    const { post, user } = response as ProductApiResponse;

    if (post.isSafeDeal && post.status === POST_STATUSES.OPEN) {
      return {
        post,
        user,
      };
    }

    throw new Error('ACCESS_DENIED');
  } catch (error_: any) {
    if (error_?.message === 'ACCESS_DENIED') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied',
        fatal: true,
      });
    }

    if (error_?.code === 'functions/not-found') {
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

const post = computed(() => product.value?.post);
const formattedPrice = computed(() => formatCurrency(`${post.value?.price}`));

const user = computed(() => product.value?.user);

const { data: points, error: errorPoints } = await useAsyncData(async () => {
  try {
    const points = await $fire.https('getPickupPoints');

    return points?.list?.map(({ id, address }: { id: string; address: string }) => ({ value: id, text: address }));
  } catch (error_) {
    if (error_?.code === 'functions/not-found') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not found',
        fatal: true,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load pickup points',
      fatal: true,
    });
  }
});

if (errorPoints?.value) {
  throw createError(errorPoints.value);
}

const point = ref('');

const isSafeDealLoading = ref(false);

const createOrder = async () => {
  try {
    isSafeDealLoading.value = true;

    const order = await $fire.https('createOrder', {
      postId: post.value?.id,
      pointId: point.value,
    });

    if (order?.orderId) {
      await navigateTo({
        name: 'order-orderId',
        params: { orderId: order.orderId },
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSafeDealLoading.value = false;
  }
};

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "making_deal": "Making Safe Deal",
    "select_point": "Select your pick-up point",
    "select": "Select",
    "recipient": "Recipient",
    "confirm_order": "Confirm order"
  },
  "pt": {
    "making_deal": "Negociação Segura em Andamento",
    "select_point": "Selecione seu ponto de retirada",
    "select": "Selecionar",
    "recipient": "Destinatário",
    "confirm_order": "Confirmar pedido"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h2
      :class="$style.title"
      v-text="t('making_deal')"
    />

    <section :class="$style.section">
      <main :class="$style.main">
        <div :class="$style.card">
          <div :class="$style.product">
            <div :class="$style.photo">
              <NuxtImg
                :src="post?.preview"
                :alt="post?.title"
                :class="$style.productPhoto"
                loading="lazy"
              />
            </div>

            <div :class="$style.productInfo">
              <span
                :class="$style.productPrice"
                v-text="formattedPrice"
              />

              <span
                :class="$style.productTitle"
                v-text="post?.title"
              />

              <UserInfoShort
                :user="user"
                :class="$style.productSeller"
              />
            </div>
          </div>
        </div>

        <h3
          :class="$style.title"
          v-text="t('select_point')"
        />

        <UISelect
          v-model="point"
          :options="points"
          :placeholder="t('select')"
          :class="$style.points"
        />

        <div :class="$style.buttonWrap">
          <UIButton
            :isLoading="isSafeDealLoading"
            :text="t('confirm_order')"
            :class="$style.button"
            @click="createOrder"
          />
        </div>
      </main>

      <aside :class="$style.rightColumn" />
    </section>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  height: 100%;
  padding: 24px 20px;
}

.title {
  @include ui-typo-24-bold;
}

.section {
  display: flex;
  margin-top: 20px;

  @include md {
    flex-direction: column;
  }

  @include exclude-md {
    flex-direction: row;
  }
}

.main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;

  @include md {
    width: 100%;
  }

  @include exclude-md {
    width: 70%;
    padding-right: 20px;
  }
}

.rightColumn {

  @include md {
    width: 100%;
  }

  @include exclude-md {
    width: 30%;
    min-width: 0;
    margin: 0;
  }
}

.card {
  @include ui-round-content-blocks;

  display: flex;
  margin-bottom: 20px;
}

.product {
  display: flex;
}


.photo {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.productPhoto {
  @include ui-round-ui-elements;

  width: 100%;
  height: 100%;
  object-fit: cover;
}

.productInfo {
  display: flex;
  flex-direction: column;
}

.productPrice {
  @include ui-typo-18-bold;
}

.productTitle {
  @include ui-typo-15;
  margin-top: 10px;
}

.productSeller {
  margin-top: auto;

  @include sm {
    display: none;
  }
}

.points {
  margin-top: 20px;
}

.buttonWrap {
  margin-top: 20px;
}

.button {
  width: 100%;
}
</style>
