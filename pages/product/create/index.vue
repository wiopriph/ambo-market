<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { boolean, object, string } from 'yup';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';


const {
  isLoggedIn,
  currentUser,
} = useUser();

watch(isLoggedIn, (state) => {
  if (!state) {
    navigateTo('/');
  }
});

definePageMeta({
  middleware: defineNuxtRouteMiddleware(async (to) => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn.value) {
      return navigateTo(`/auth?redirect=${to.path}`);
    }
  }),
});


const needPhoneNumber = computed(() => isLoggedIn.value && currentUser.value && !currentUser.value.phone);

const { t } = useI18n();

const {
  errors,
  handleSubmit,
  handleReset,
} = useForm({
  initialValues: {
    category: '',
    productName: '',
    price: '',
    description: '',
    isSafeDeal: false,
  },
  validationSchema: object({
    category: string().required(t('validation.required')),
    productName: string().required(t('validation.required')),
    price: string().required(t('validation.required')),
    description: string().required(t('validation.required')),
    isSafeDeal: boolean(),
  }),
});

const { value: category } = useField<string>('category');
const { value: productName } = useField<string>('productName');
const { value: price } = useField<string>('price');
const { value: description } = useField<string>('description');
const { value: isSafeDeal } = useField<boolean>('isSafeDeal');


const categoriesItems = computed(() => CATEGORIES.map(({ type }) => ({ value: type, text: t(type) })));


type Image = {
  base64: string;
  mimeType: string;
};

const images = ref<Image[]>([]);

const hasPhotos = computed(() => images.value.length > 0);

const availableImages = computed(() => {
  const MAX_IMAGES = 4;

  return Math.max(0, MAX_IMAGES - images.value.length);
});

const deletePhoto = (index: number) => {
  images.value.splice(index, 1);
};

const fileInput = ref(null);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input?.files) {
    return;
  }

  const files = Array.from(input.files);

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (event_) => {
      images.value.push({
        base64: event_.target?.result as string,
        mimeType: file?.type,
      });
    };

    reader.readAsDataURL(file);

    fileInput.value = null;
  });
};

const loadFile = () => {
  fileInput.value?.click();
};


type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

const location = ref<Location | {}>({});

const hasLocation = computed(() => Object.keys(location.value).length > 0);

const setLocation = (payload: Location) => {
  location.value = payload;
};


const progress = computed(() => [
  { active: !!category.value, label: t('category') },
  { active: !!productName.value, label: t('product_name') },
  { active: !!price.value, label: t('price') },
  { active: !!description.value, label: t('description') },
  { active: hasPhotos.value, label: t('photos') },
  { active: hasLocation.value, label: t('location') },
]);


const isModalVisible = ref(false);

const showSuccessModal = () => {
  isModalVisible.value = true;
};

const hideSuccessModal = () => {
  isModalVisible.value = false;
};


const clearFields = () => {
  category.value = '';
  productName.value = '';
  description.value = '';
  price.value = '';
  isSafeDeal.value = false;
  images.value = [];
};


const { $fire } = useNuxtApp();

const isLoading = ref(false);
const hasAPIError = ref(false);
const createdProduct = ref({});

const createPost = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    const post = await $fire.https('createPost', {
      title: productName.value,
      description: description.value,
      price: +price.value,
      categoryId: category.value,
      images: images.value,
      location: location.value,
      isSafeDeal: isSafeDeal.value,
    });

    createdProduct.value = {
      title: productName.value,
      route: {
        name: 'product-productId',
        params: { productId: post?.id },
      },
    };

    isLoading.value = false;

    showSuccessModal();
    clearFields();
    handleReset(); // @todo: может clearFields не нужен
  } catch (error) {
    isLoading.value = false;
    hasAPIError.value = true;
  }
});
</script>

<i18n>
{
  "en": {
    "category": "Category",
    "category_list": "Category List",
    "product_name": "Product name",
    "price": "Price",
    "description": "Description",
    "photos": "Photos",
    "photos_notice": {
      "first": "The first photo will be displayed in search results, choose the most suitable one.",
      "second": "You can upload up to 4 photos in JPG or PNG format."
    },
    "add_photo": "Add photo",
    "location": "Location",
    "safe_deal": "Safe deal",
    "safe_deal_description": "Your items are available for sale under {deal}.",
    "place_ad": "Place Ad"
  },
  "pt": {
    "category": "Categoria",
    "category_list": "Lista de categorias",
    "product_name": "Nome do produto",
    "price": "Preço",
    "description": "Descrição",
    "photos": "Fotos",
    "photos_notice": {
      "first": "A primeira foto será exibida nos resultados da pesquisa, escolha a mais adequada.",
      "second": "Você pode fazer upload de até 4 fotos no formato JPG ou PNG."
    },
    "add_photo": "Adicionar foto",
    "location": "Localização",
    "safe_deal": "Negociação segura",
    "safe_deal_description": "Seus itens estão disponíveis para venda no {deal}.",
    "place_ad": "Coloque anúncio"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.content">
      <div :class="$style.main">
        <div v-if="needPhoneNumber">
          <UserPhone />
        </div>

        <form
          v-else
          :class="$style.form"
          @submit.prevent="createPost"
        >
          <UILineDescription
            :title="t('category')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div>
              <UICustomSelect
                v-model="category"
                :options="categoriesItems"
                :placeholder="t('category_list')"
                :error="errors.category"
                isRequired
                name="category"
              />

              <UIError :text="errors.category" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('product_name')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div>
              <UIInput
                v-model="productName"
                :error="errors.productName"
                isRequired
                name="productName"
                type="text"
              />

              <UIError :text="errors.productName" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('price')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div>
              <div :class="$style.price">
                <UIInput
                  v-model="price"
                  :error="errors.price"
                  isRequired
                  name="price"
                  type="number"
                />

                <span
                  :class="$style.currency"
                  v-text="'AOA'"
                />
              </div>

              <UIError :text="errors.price" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('description')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div>
              <UIInputTextArea
                v-model="description"
                :error="errors.description"
                isRequired
                name="text"
              />

              <UIError :text="errors.description" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('photos')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div>
              <input
                v-show="false"
                ref="fileInput"
                accept="image/jpg,image/jpeg,image/png,image/bmp"
                type="file"
                multiple
                @change="handleFileUpload"
              >

              <ul :class="$style.imagesList">
                <li
                  v-for="(image, index) in images"
                  :key="`product_image_${index}`"
                  :class="$style.imageItem"
                >
                  <ProductUploadPhoto
                    :image="image.base64"
                    @delete="deletePhoto(index)"
                  />
                </li>

                <li
                  v-for="(_, index) of availableImages"
                  :key="`available_${index}`"
                  :class="$style.imageItem"
                  @click="loadFile"
                >
                  <ProductUploadPhoto />
                </li>
              </ul>

              <div :class="$style.imagesNotice">
                <p v-text="t('photos_notice.first')" />

                <p v-text="t('photos_notice.second')" />
              </div>
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('location')"
            :class="$style.line"
            position="center"
            requiredTitle
            boldTitle
          >
            <div :class="$style.addressCol">
              <ClientOnly>
                <GeolocationSelector
                  :class="$style.map"
                  hideRadius
                  @select="setLocation"
                />
              </ClientOnly>
            </div>
          </UILineDescription>

          <UILineDescription
            v-if="false"
            :title="t('safe_deal')"
            :class="$style.line"
            position="center"
            boldTitle
          >
            <div :class="$style.safeDeal">
              <UICheckbox
                v-model="isSafeDeal"
                name="isSafeDeal"
                isRequired
              />

              <I18nT
                :class="$style.safeDealText"
                keypath="safe_deal_description"
                tag="span"
              >
                <template #deal>
                  <NuxtLink
                    :to="{ name: 'index' }"
                    target="_blank"
                  >
                    {{ t('safe_deal') }}
                  </NuxtLink>
                </template>
              </I18nT>
            </div>
          </UILineDescription>

          <UILineDescription
            :class="$style.line"
            position="center"
          >
            <UIButton
              :text="t('place_ad')"
              :isLoading="isLoading"
              :class="$style.placeButton"
              @click="createPost"
            />
          </UILineDescription>

          <transition name="fade">
            <LazyProductCreateModal
              v-if="isModalVisible"
              :title="createdProduct?.title"
              :route="createdProduct?.route"
              @close="hideSuccessModal"
            />
          </transition>
        </form>
      </div>

      <div :class="$style.right">
        <UIProgressBar
          v-if="!needPhoneNumber"
          :list="progress"
          :class="$style.progress"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 24px 20px;
}

.content {
  display: flex;
}

.main {
  flex: 1 1;
  min-width: 0;
}

.right {
  @include md {
    display: none;
  }

  position: relative;
  flex: 0 300px;
  max-width: 300px;
  margin-left: 10px;
}

.form {

  @include exclude-md {
    @include ui-round-content-blocks;

    padding: 10px 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.line {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.imagesList {
  @include ui-row;

  width: 100%;
  height: 100%;
}

.imageItem {
  @include ui-col-ready;
  @include ui-col-vertical-gutter;

  position: relative;

  @include md {
    @include ui-col(6);
  }

  @include exclude-md {
    @include ui-col(3);
  }
}

.imagesNotice {
  @include ui-typo-14;

  margin-top: 10px;
  color: $ui-color-text-main;
}

.price {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.currency {
  @include ui-typo-18;

  margin-left: 10px;
  color: $ui-color-black;
}

.addressCol {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.map {
  z-index: 0;
  width: 100%;
  height: 100%;
  min-height: 400px;
  max-height: 600px;
}

.safeDeal {
  display: flex;
  align-items: center;
}

.safeDealText {
  margin-left: 10px;
}

.placeButton {
  width: 100%;
}

.progress {
  position: sticky;
  top: (64px + 10px);
}
</style>
