<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { array, object, string } from 'yup';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import { getProductAttributeFields } from '~/constants/productAttributes';


definePageMeta({ middleware: 'auth' });

const { currentUser } = useUser();

const needPhoneNumber = computed(() => currentUser.value && !currentUser.value.phone);

type Image = {
  base64: string;
  mimeType: string;
};

type SelectItem = {
  label: string;
  value: string;
};

const metaTitle = 'Publicar anúncio grátis - Ambo Market';
const metaDescription = 'Crie um anúncio classificado grátis na Ambo Market. Adicione cidade, categoria, preço, descrição e fotos em poucos passos.';

useHead({
  title: metaTitle,
  meta: [
    { key: 'description', name: 'description', content: metaDescription },
    { key: 'og:title', property: 'og:title', content: metaTitle },
    { key: 'og:description', property: 'og:description', content: metaDescription },
    { key: 'twitter:title', property: 'twitter:title', content: metaTitle },
    { key: 'twitter:description', property: 'twitter:description', content: metaDescription },
    { key: 'robots', name: 'robots', content: 'noindex, nofollow' },
  ],
});

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
    attributes: {},
  },
  validationSchema: object({
    category: string().required('Este campo é obrigatório'),
    subcategory: string()
      .test('subcategory-required', 'Este campo é obrigatório', function(value) {
        const categoryId = this.parent.category;
        const category = CATEGORIES.find(c => c.id === categoryId);

        if (category?.subcategories?.length) return !!value;

        return true;
      }),
    brand: string()
      .test('brand-required', 'Este campo é obrigatório', function(value) {
        const categoryId = this.parent.category;
        const subcategoryId = this.parent.subcategory;
        const category = CATEGORIES.find(c => c.id === categoryId);
        const subcategory = category?.subcategories?.find(sc => sc.id === subcategoryId);

        if (subcategory?.brands?.length) return !!value;

        return true;
      }),
    productName: string()
      .required('Este campo é obrigatório')
      .max(50, 'Ultrapassou o limite de 50 caracteres.'),
    price: string().required('Este campo é obrigatório'),
    description: string().required('Este campo é obrigatório'),
    images: array().min(1, 'Por favor, adicione pelo menos uma foto'),
    cityId: string().required('Este campo é obrigatório'),
    attributes: object().test('attributes-required', 'Preencha os campos obrigatórios', function(value) {
      const categoryId = this.parent.category;
      const subcategoryId = this.parent.subcategory;
      const fields = getProductAttributeFields(categoryId, subcategoryId);
      const missing = fields.filter(field => field.required && !value?.[field.key] && value?.[field.key] !== 0);

      if (missing.length) {
        return this.createError({ message: `Preencha: ${missing.map(field => field.label).join(', ')}` });
      }

      return true;
    }),
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
const { value: attributes } = useField<Record<string, unknown>>('attributes');

const toOptions = (arr?: Array<{ id: string; name: string }>): SelectItem[] =>
  (arr ?? []).map(({ id, name }) => ({ value: id, label: name }));

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

const attributeFields = computed(() => getProductAttributeFields(category.value, subcategory.value));

const deletePhoto = (index: number) => {
  images.value.splice(index, 1);
};

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input?.files) return;

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

const loadFile = () => fileInput.value?.click();

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
      attributes: {},
    },
  });
};

const isLoading = ref(false);
const hasAPIError = ref(false);
const apiErrorMessage = ref('');

const createPost = handleSubmit.withControlled(async () => {
  if (isLoading.value) return;

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
        location: { cityId: cityId.value },
        attributes: attributes.value,
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
  attributes.value = {};
});

watch(subcategory, () => {
  brand.value = '';
  attributes.value = {};
});
</script>

<template>
  <div class="mx-auto w-full max-w-3xl space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        Publicar anúncio
      </h1>

      <p class="mt-0.5 text-sm text-muted">
        Preencha os detalhes, adicione fotos e publique o anúncio.
      </p>
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
            label="Cidade"
            :error="errors.cityId"
            name="city"
            required
          >
            <USelect
              v-model="cityId"
              :items="citiesItems"
              valueKey="value"
              labelKey="label"
              placeholder="Selecione uma cidade"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            label="Categoria"
            :error="errors.category"
            name="category"
            required
          >
            <USelect
              v-model="category"
              :items="categoriesItems"
              valueKey="value"
              labelKey="label"
              placeholder="Selecione"
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
            label="Subcategoria"
            :error="errors.subcategory"
            name="subcategory"
            required
          >
            <USelect
              v-model="subcategory"
              :items="subcategoriesItems"
              valueKey="value"
              labelKey="label"
              placeholder="Selecione"
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
            label="Marca"
            :error="errors.brand"
            name="brand"
            required
          >
            <USelect
              v-model="brand"
              :items="brandsItems"
              valueKey="value"
              labelKey="label"
              placeholder="Selecione"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <ProductAttributesFields
        v-model="attributes"
        :fields="attributeFields"
      />

      <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
        <div class="px-5 py-4">
          <UFormField
            label="Nome do produto"
            help="O nome não deve exceder os 50 caracteres."
            :error="errors.productName"
            name="productName"
            required
          >
            <UInput
              v-model="productName"
              name="productName"
              type="text"
              placeholder="Nome curto e claro do produto"
              maxlength="50"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            label="Preço"
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
              placeholder="Digite o preço"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="px-5 py-4">
          <UFormField
            label="Descrição"
            :error="errors.description"
            name="description"
            required
          >
            <UTextarea
              v-model="description"
              name="description"
              placeholder="Adicione estado, acessórios, opções de entrega e outros detalhes úteis."
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
          <p class="text-sm font-semibold text-highlighted">
            Fotos
          </p>

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
                :alt="`Fotos ${index + 1}`"
                class="size-full object-cover"
              >
            </div>

            <button
              type="button"
              class="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
              aria-label="Remover foto"
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
          label="Adicionar fotos"
          block
          @click="loadFile"
        />

        <div class="space-y-1 text-xs text-muted">
          <p>
            A primeira foto será exibida nos resultados da pesquisa.
          </p>

          <p>
            Use fotos claras em JPG ou PNG.
          </p>
        </div>
      </div>

      <UAlert
        v-if="hasAPIError"
        color="error"
        variant="soft"
        title="Não foi possível criar o anúncio"
        :description="apiErrorMessage"
      />

      <div v-if="errors.attributes">
        <p
          class="text-sm text-error"
          v-text="errors.attributes"
        />
      </div>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="isLoading"
        label="Publicar anúncio"
        block
      />

      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        size="lg"
        label="Limpar formulário"
        block
        @click="clearFields"
      />
    </form>
  </div>
</template>
