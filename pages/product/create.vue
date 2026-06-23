<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { array, object, string } from 'yup';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';


definePageMeta({ middleware: 'auth' });

const { currentUser } = useUser();

const needPhoneNumber = computed(() => currentUser.value && !currentUser.value.phone);

const { t } = useI18n();

type Image = {
  base64: string;
  mimeType: string;
};

type SelectItem = {
  label: string;
  value: string;
};

const title = computed(() => t('meta_title'));
const descriptionMeta = computed(() => t('meta_description'));

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'description', name: 'description', content: descriptionMeta.value },
  { key: 'og:description', property: 'og:description', content: descriptionMeta.value },
  { key: 'twitter:description', property: 'twitter:description', content: descriptionMeta.value },
]);

useHead({ title: title.value, meta: meta.value });

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
    images: [],
    cityId: '',
  },
  validationSchema: object({
    category: string()
      .required(t('validation.required')),
    subcategory: string()
      .test('subcategory-required', t('validation.required'), function(value) {
        const categoryId = this.parent.category;
        const category = CATEGORIES.find(c => c.id === categoryId);

        if (category?.subcategories?.length) {
          return !!value;
        }

        return true;
      }),

    brand: string()
      .test('brand-required', t('validation.required'), function(value) {
        const categoryId = this.parent.category;
        const subcategoryId = this.parent.subcategory;
        const category = CATEGORIES.find(c => c.id === categoryId);
        const subcategory = category?.subcategories?.find(sc => sc.id === subcategoryId);

        if (subcategory?.brands?.length) {
          return !!value;
        }

        return true;
      }),

    productName: string()
      .required(t('validation.required'))
      .max(50, t('validation.productNameMaxLength')),
    price: string()
      .required(t('validation.required')),
    description: string()
      .required(t('validation.required')),
    images: array()
      .min(1, t('validation.imagesRequired')),
    cityId: string()
      .required(t('validation.required')),
  }),
});

const { value: category } = useField<string>('category');
const { value: subcategory } = useField<string>('subcategory');
const { value: brand } = useField<string>('brand');
const { value: productName } = useField<string>('productName');
const { value: price } = useField<string>('price');
const { value: description } = useField<string>('description');
const { value: images } = useField<Image[]>('images');
const { value: cityId } = useField<string>('cityId');

const toOptions = (arr?: Array<{ id: string; key: string }>): SelectItem[] =>
  (arr ?? []).map(({ id, key }) => ({ value: id, label: t(key) }));


const currentCategory = computed(() => CATEGORIES.find(c => c.id === category.value));
const currentSubcategory = computed(() =>
  currentCategory.value?.subcategories?.find(sc => sc.id === subcategory.value) ?? null,
);

const categoriesItems = computed<SelectItem[]>(() => toOptions(CATEGORIES));
const subcategoriesItems = computed<SelectItem[]>(() => toOptions(currentCategory.value?.subcategories));
const brandsItems = computed<SelectItem[]>(() => toOptions(currentSubcategory.value?.brands));
const citiesItems = computed<SelectItem[]>(() => CITIES
  .filter(city => city.id !== 'all')
  .map(city => ({ value: city.id, label: city.name })));

const deletePhoto = (index: number) => {
  images.value.splice(index, 1);
};

const fileInput = ref<HTMLInputElement | null>(null);

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
  });

  input.value = '';
};

const loadFile = () => {
  fileInput.value?.click();
};

const clearFields = () => {
  resetForm({
    values: {
      category: '',
      subcategory: '',
      brand: '',
      productName: '',
      price: '',
      description: '',
      images: [],
      cityId: '',
    },
  });
};

const isLoading = ref(false);
const hasAPIError = ref(false);
const apiErrorMessage = ref('');

const createPost = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  hasAPIError.value = false;
  apiErrorMessage.value = '';

  try {
    const { id } = await $fetch<{ id: string }>('/api/posts', {
      method: 'POST',
      body: {
        title: productName.value,
        description: description.value,
        price: +price.value,
        categoryId: category.value,
        subcategoryId: subcategory.value,
        brandId: brand.value,
        images: images.value,
        location: {
          cityId: cityId.value,
        },
      },
    });

    navigateTo({ name: 'product-productId', params: { productId: id } });
    clearFields();
  } catch (error: any) {
    const statusCode = error?.statusCode ?? error?.status ?? error?.response?.status;
    const statusMessage =
      error?.statusMessage ??
      error?.data?.statusMessage ??
      error?.message ??
      '';

    if (statusCode === 400 && statusMessage === 'Phone number is required to create a post') {
      if (currentUser.value) {
        currentUser.value = { ...currentUser.value, phone: null };
      }

      return;
    }

    hasAPIError.value = true;
    apiErrorMessage.value = statusMessage || 'Something went wrong';
  } finally {
    isLoading.value = false;
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
    "meta_title": "Post a free ad - Ambo Market",
    "meta_description": "Create a free classified ad on Ambo Market. Add the city, category, price, description and photos in a few simple steps.",
    "h1": "Post an ad",
    "intro": "Fill in the details, add photos, and publish your listing.",
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "product_name": "Product name",
    "product_name_placeholder": "Example: iPhone 13 Pro 128 GB",
    "product_name_length": "The name must not exceed 50 characters.",
    "price": "Price",
    "price_placeholder": "Enter the price",
    "description": "Description",
    "description_placeholder": "Add condition, accessories, delivery options and other useful details.",
    "photos": "Photos",
    "photos_notice": {
      "first": "The first photo will be displayed in search results.",
      "second": "Use clear JPG or PNG photos."
    },
    "add_photo": "Add photos",
    "remove_photo": "Remove photo",
    "city": "City",
    "select_city": "Select a city",
    "place_ad": "Place ad",
    "clear_form": "Clear form",
    "api_error_title": "Could not create the ad"
  },
  "pt": {
    "meta_title": "Publicar anúncio grátis - Ambo Market",
    "meta_description": "Crie um anúncio classificado grátis na Ambo Market. Adicione cidade, categoria, preço, descrição e fotos em poucos passos.",
    "h1": "Publicar anúncio",
    "intro": "Preencha os detalhes, adicione fotos e publique o anúncio.",
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "product_name": "Nome do produto",
    "product_name_placeholder": "Exemplo: iPhone 13 Pro 128 GB",
    "product_name_length": "O nome não deve exceder os 50 caracteres.",
    "price": "Preço",
    "price_placeholder": "Digite o preço",
    "description": "Descrição",
    "description_placeholder": "Adicione estado, acessórios, opções de entrega e outros detalhes úteis.",
    "photos": "Fotos",
    "photos_notice": {
      "first": "A primeira foto será exibida nos resultados da pesquisa.",
      "second": "Use fotos claras em JPG ou PNG."
    },
    "add_photo": "Adicionar fotos",
    "remove_photo": "Remover foto",
    "city": "Cidade",
    "select_city": "Selecione uma cidade",
    "place_ad": "Publicar anúncio",
    "clear_form": "Limpar formulário",
    "api_error_title": "Não foi possível criar o anúncio"
  }
}
</i18n>

<template>
  <div class="w-full mx-auto max-w-3xl px-4 sm:px-5 py-4 sm:py-6 space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1
        class="text-lg font-bold text-highlighted"
        v-text="t('h1')"
      />

      <p
        class="mt-0.5 text-sm text-muted"
        v-text="t('intro')"
      />
    </div>

    <div
      v-if="needPhoneNumber"
      class="rounded-2xl border border-default bg-default p-5"
    >
      <LazyUserPhone />
    </div>

    <form
      v-else
      class="space-y-3"
      @submit.prevent="createPost"
    >
      <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
        <div class="px-5 py-4">
          <UFormField
            :label="t('city')"
            :error="errors.cityId"
            name="city"
            required
          >
            <USelect
              v-model="cityId"
              :items="citiesItems"
              valueKey="value"
              labelKey="label"
              :placeholder="t('select_city')"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            :label="t('category')"
            :error="errors.category"
            name="category"
            required
          >
            <USelect
              v-model="category"
              :items="categoriesItems"
              valueKey="value"
              labelKey="label"
              :placeholder="t('select')"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div
          v-if="subcategoriesItems.length"
          class="px-5 py-4"
        >
          <UFormField
            :label="t('subcategory')"
            :error="errors.subcategory"
            name="subcategory"
            required
          >
            <USelect
              v-model="subcategory"
              :items="subcategoriesItems"
              valueKey="value"
              labelKey="label"
              :placeholder="t('select')"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div
          v-if="brandsItems.length"
          class="px-5 py-4"
        >
          <UFormField
            :label="t('brand')"
            :error="errors.brand"
            name="brand"
            required
          >
            <USelect
              v-model="brand"
              :items="brandsItems"
              valueKey="value"
              labelKey="label"
              :placeholder="t('select')"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
        <div class="px-5 py-4">
          <UFormField
            :label="t('product_name')"
            :help="t('product_name_length')"
            :error="errors.productName"
            name="productName"
            required
          >
            <UInput
              v-model="productName"
              name="productName"
              type="text"
              :placeholder="t('product_name_placeholder')"
              maxlength="50"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            :label="t('price')"
            :error="errors.price"
            name="price"
            required
          >
            <UInput
              v-model="price"
              name="price"
              type="number"
              min="0"
              inputmode="decimal"
              :placeholder="t('price_placeholder')"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            :label="t('description')"
            :error="errors.description"
            name="description"
            required
          >
            <UTextarea
              v-model="description"
              name="description"
              :placeholder="t('description_placeholder')"
              :rows="5"
              :maxrows="10"
              autoresize
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <div class="rounded-2xl border border-default bg-default p-5 space-y-4">
        <div>
          <p
            class="text-sm font-semibold text-highlighted"
            v-text="t('photos')"
          />

          <p
            v-if="errors.images"
            class="mt-1 text-sm text-error"
            v-text="errors.images"
          />
        </div>

        <input
          ref="fileInput"
          class="hidden"
          accept="image/jpg,image/jpeg,image/png,image/bmp"
          type="file"
          multiple
          @change="handleFileUpload"
        >

        <div
          v-if="images.length"
          class="grid grid-cols-3 gap-2 sm:grid-cols-4"
        >
          <div
            v-for="(image, index) in images"
            :key="`product_image_${index}`"
            class="group relative"
          >
            <div class="aspect-square overflow-hidden rounded-xl border border-default bg-muted">
              <img
                :src="image.base64"
                :alt="`${t('photos')} ${index + 1}`"
                class="size-full object-cover"
              >
            </div>

            <button
              type="button"
              class="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
              :aria-label="t('remove_photo')"
              @click="deletePhoto(index)"
            >
              <UIcon
                name="i-lucide-x"
                class="size-3.5"
              />
            </button>

            <span
              v-if="index === 0"
              class="absolute bottom-1.5 left-1.5 rounded-md bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-white"
            >
              1
            </span>
          </div>

          <button
            type="button"
            class="aspect-square rounded-xl border-2 border-dashed border-default flex flex-col items-center justify-center gap-1 text-muted transition hover:border-primary hover:text-primary"
            @click="loadFile"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-5"
            />
          </button>
        </div>

        <UButton
          v-if="!images.length"
          type="button"
          color="neutral"
          variant="soft"
          size="lg"
          icon="i-lucide-image-plus"
          :label="t('add_photo')"
          block
          @click="loadFile"
        />

        <div class="space-y-1 text-xs text-muted">
          <p v-text="t('photos_notice.first')" />

          <p v-text="t('photos_notice.second')" />
        </div>
      </div>

      <UAlert
        v-if="hasAPIError"
        color="error"
        variant="soft"
        :title="t('api_error_title')"
        :description="apiErrorMessage"
      />

      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="isLoading"
        :label="t('place_ad')"
        block
      />

      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        size="lg"
        :label="t('clear_form')"
        block
        @click="clearFields"
      />
    </form>
  </div>
</template>
