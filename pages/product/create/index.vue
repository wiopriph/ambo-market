<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { boolean, object, array, string } from 'yup';
import type { RouteLocationRaw } from 'vue-router';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';
import { CURRENCY } from '~/constants/currency';
import type { Option } from '~/components/UI/Select/types';


definePageMeta({
  middleware: 'auth',
});

const { currentUser } = useUser();

const needPhoneNumber = computed(() => currentUser.value && !currentUser.value.phone);

const { t } = useI18n();

type Image = {
  base64: string;
  mimeType: string;
};

type Location = {
  lat: number;
  lon: number;
  cityId: string;
  city: string;
  displayName: string;
  address: string;
};

const {
  errors,
  handleSubmit,
  resetForm,
} = useForm({
  initialValues: {
    category: '',
    subcategory: '',
    brand: '',
    productName: '',
    price: '',
    description: '',
    isSafeDeal: false,
    images: [],
    location: {},
  },
  validationSchema: object({
    category: string().required(t('validation.required')),
    subcategory: string().test('subcategory-required', t('validation.required'), function(value) {
      const categoryId = this.parent.category;
      const category = CATEGORIES.find(c => c.id === categoryId);

      if (category?.subcategories?.length) {
        return !!value;
      }

      return true;
    }),

    brand: string().test('brand-required', t('validation.required'), function(value) {
      const categoryId = this.parent.category;
      const subcategoryId = this.parent.subcategory;
      const category = CATEGORIES.find(c => c.id === categoryId);
      const subcategory = category?.subcategories?.find(sc => sc.id === subcategoryId);

      if (subcategory?.brands?.length) {
        return !!value;
      }

      return true;
    }),

    productName: string().required(t('validation.required'))
      .max(50, t('validation.productNameMaxLength')),
    price: string().required(t('validation.required')),
    description: string().required(t('validation.required')),
    isSafeDeal: boolean(),
    images: array().min(1, t('validation.imagesRequired')),
    location: object().required(t('validation.required')),
  }),
});

const { value: category } = useField<string>('category');
const { value: subcategory } = useField<string>('subcategory');
const { value: brand } = useField<string>('brand');
const { value: productName } = useField<string>('productName');
const { value: price } = useField<string>('price');
const { value: description } = useField<string>('description');
const { value: isSafeDeal } = useField<boolean>('isSafeDeal');
const { value: images } = useField<Image[]>('images');
const { value: location } = useField<Location>('location');


const toOptions = (arr?: Array<{ id: string; key: string }>): Option[] =>
  (arr ?? []).map(({ id, key }) => ({ value: id, text: t(key) }));


const currentCategory = computed(() => CATEGORIES.find(c => c.id === category.value));
const currentSubcategory = computed(() =>
  currentCategory.value?.subcategories?.find(sc => sc.id === subcategory.value) ?? null,
);

const categoriesItems = computed<Option[]>(() => toOptions(CATEGORIES));
const subcategoriesItems = computed<Option[]>(() => toOptions(currentCategory.value?.subcategories));
const brandsItems = computed<Option[]>(() => toOptions(currentSubcategory.value?.brands));


const hasSafeDeal = computed(() => !!currentCategory.value?.hasSafeDeal);

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
  resetForm({
    values: {
      category: '',
      productName: '',
      price: '',
      description: '',
      isSafeDeal: false,
      images: [],
      location: location.value,
    },
  });
};

const { $fire } = useNuxtApp();

const isLoading = ref(false);
const hasAPIError = ref(false);
const createdProduct = ref<{ title: string; route: RouteLocationRaw } | null>(null);

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
      subcategoryId: subcategory.value,
      brandId: brand.value,
      images: images.value,
      location: location.value,
      isSafeDeal: hasSafeDeal.value && isSafeDeal.value,
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
  } catch (error) {
    isLoading.value = false;
    hasAPIError.value = true;
  }
});

watch(category, () => {
  subcategory.value = '';
  brand.value = '';
});

watch(subcategory, () => {
  brand.value = '';
});
</script>

<i18n>
{
  "en": {
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "product_name": "Product name",
    "product_name_length": "The name must not exceed 50 characters.",
    "price": "Price",
    "description": "Description",
    "photos": "Photos",
    "photos_notice": {
      "first": "The first photo will be displayed in search results, choose the most suitable one.",
      "second": "You can upload up to 4 photos in JPG or PNG format."
    },
    "add_photo": "Add photo",
    "location": "Location",
    "enter_your_address": "Enter your address or select a location on the map below",
    "safe_deal": "Safe deal",
    "safe_deal_description": "Your items are available for sale under {deal}.",
    "place_ad": "Place Ad"
  },
  "pt": {
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "product_name": "Nome do produto",
    "product_name_length": "O nome não deve exceder os 50 caracteres.",
    "price": "Preço",
    "description": "Descrição",
    "photos": "Fotos",
    "photos_notice": {
      "first": "A primeira foto será exibida nos resultados da pesquisa, escolha a mais adequada.",
      "second": "Você pode fazer upload de até 4 fotos no formato JPG ou PNG."
    },
    "add_photo": "Adicionar foto",
    "location": "Localização",
    "enter_your_address": "Insira o seu endereço ou selecione um local no mapa abaixo",
    "safe_deal": "Negócio Seguro",
    "safe_deal_description": "Seus itens estão disponíveis para venda no {deal}.",
    "place_ad": "Publicar Anúncio"
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
            requiredTitle
            boldTitle
          >
            <div>
              <UISelect
                v-model="category"
                :options="categoriesItems"
                :placeholder="t('select')"
                :error="errors.category"
                isRequired
                name="category"
              />

              <UIError :text="errors.category" />
            </div>
          </UILineDescription>

          <UILineDescription
            v-if="subcategoriesItems.length"
            :title="t('subcategory')"
            :class="$style.line"
            requiredTitle
            boldTitle
          >
            <div>
              <UISelect
                v-model="subcategory"
                :options="subcategoriesItems"
                :placeholder="t('select')"
                :error="errors.subcategory"
                isRequired
                name="subcategory"
              />

              <UIError :text="errors.subcategory" />
            </div>
          </UILineDescription>

          <UILineDescription
            v-if="brandsItems.length"
            :title="t('brand')"
            :class="$style.line"
            requiredTitle
            boldTitle
          >
            <div>
              <UISelect
                v-model="brand"
                :options="brandsItems"
                :placeholder="t('select')"
                :error="errors.brand"
                isRequired
                name="brand"
              />

              <UIError :text="errors.brand" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('product_name')"
            :class="$style.line"
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

              <p
                v-if="!errors.productName"
                :class="$style.notice"
                v-text="t('product_name_length')"
              />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('price')"
            :class="$style.line"
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
                  v-text="CURRENCY"
                />
              </div>

              <UIError :text="errors.price" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('description')"
            :class="$style.line"
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

              <div :class="$style.notice">
                <p v-text="t('photos_notice.first')" />

                <p v-text="t('photos_notice.second')" />
              </div>

              <UIError :text="errors.images" />
            </div>
          </UILineDescription>

          <UILineDescription
            :title="t('location')"
            :class="$style.line"
            requiredTitle
            boldTitle
          >
            <div :class="$style.currentAddress">
              <strong
                v-if="location?.displayName"
                v-text="location.displayName"
              />

              <span
                v-else
                v-text="t('enter_your_address')"
              />
            </div>

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
            v-if="hasSafeDeal"
            :title="t('safe_deal')"
            :class="$style.line"
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
                    :to="{ name: 'blog-slug', params: { slug: 'como-comprar-com-seguranca-dos-vendedores' } }"
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

.notice {
  @include ui-typo-12;

  margin-top: 8px;
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

.currentAddress {
  margin-bottom: 20px;
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
