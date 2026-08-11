<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { useField, useForm } from 'vee-validate';
import { array, object, string } from 'yup';
import { useUser } from '~/composables/useUser';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import { getProductAttributeFields } from '~/constants/productAttributes';


// страница доступна без логина: авторизация запрашивается на шаге «Публикации»,
// заполненная форма переживает переход на /auth и обратно через черновик
const { currentUser, isLoggedIn } = useUser();

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
  validateField,
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
      .max(70, 'Ultrapassou o limite de 70 caracteres.'),
    price: string().required('Este campo é obrigatório'),
    description: string().required('Este campo é obrigatório'),
    images: array().min(1, 'Por favor, adicione pelo menos uma foto'),
    cityId: string().required('Este campo é obrigatório'),
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

// ── шаги визарда ──────────────────────────────────────────────────────
const WIZARD_STEPS = ['Categoria', 'Fotos', 'Detalhes'];

// поля, которые должны быть валидны для перехода с шага дальше
const STEP_FIELDS: Record<number, string[]> = {
  1: ['cityId', 'category', 'subcategory', 'brand'],
  2: ['images'],
};

const FIELD_STEP: Record<string, number> = {
  cityId: 1,
  category: 1,
  subcategory: 1,
  brand: 1,
  images: 2,
  productName: 3,
  price: 3,
  description: 3,
};

const step = ref(1);
const isLastStep = computed(() => step.value === WIZARD_STEPS.length);

const goBack = () => {
  if (step.value > 1) {
    step.value -= 1;
  }
};

const goNext = async () => {
  const results = await Promise.all(
    (STEP_FIELDS[step.value] ?? []).map(field => validateField(field)),
  );

  if (results.every(result => result.valid)) {
    step.value += 1;
  }
};

// ── черновик ──────────────────────────────────────────────────────────
// Текстовые поля — в localStorage (переживают и перезагрузку).
// Фото (base64) в localStorage не влезают — держим их в useState:
// он переживает SPA-переход на /auth и обратно, но не перезагрузку.
const DRAFT_KEY = 'post-draft';

const draftImages = useState<Image[]>('createPostDraftImages', () => []);

const saveDraft = () => {
  const draft = {
    category: category.value,
    subcategory: subcategory.value,
    brand: brand.value,
    productName: productName.value,
    price: price.value,
    description: description.value,
    cityId: cityId.value,
    attributes: attributes.value,
    step: step.value,
  };

  const { step: _step, ...fields } = draft;

  if (Object.values(fields).some(value => value && Object.keys(value).length !== 0)) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } else {
    localStorage.removeItem(DRAFT_KEY);
  }

  draftImages.value = images.value;
};

const saveDraftDebounced = useDebounceFn(saveDraft, 500);

const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
  draftImages.value = [];
};

// watch(category/subcategory) сбрасывают зависимые поля — при программном
// восстановлении черновика этот сброс затирал восстановленные значения
let isRestoringDraft = false;

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const draft = raw ? JSON.parse(raw) : null;

    if (draft || draftImages.value.length) {
      const { step: draftStep, ...draftFields } = draft ?? {};

      isRestoringDraft = true;

      resetForm({
        values: {
          category: '',
          subcategory: '',
          brand: '',
          productName: '',
          price: '',
          description: '',
          cityId: '',
          attributes: {},
          ...draftFields,
          images: draftImages.value,
        },
      });

      const restored = Number(draftStep);

      if (restored >= 1 && restored <= WIZARD_STEPS.length) {
        step.value = restored;
      }

      nextTick(() => {
        isRestoringDraft = false;
      });
    }
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
});

watch(
  [category, subcategory, brand, productName, price, description, cityId, attributes, images, step],
  () => saveDraftDebounced(),
  { deep: true },
);

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
  clearDraft();
  step.value = 1;

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

// при невалидном сабмите ошибка может быть на скрытом шаге —
// возвращаем пользователя к самому раннему шагу с проблемой
const onInvalidSubmit = ({ errors: submitErrors }: { errors: Record<string, string> }) => {
  const steps = Object.keys(submitErrors)
    .map(field => FIELD_STEP[field])
    .filter(Boolean);

  if (steps.length) {
    step.value = Math.min(...steps);
  }
};

const createPost = handleSubmit.withControlled(async () => {
  if (isLoading.value) return;

  // гость: сохраняем черновик и уводим на вход — после логина
  // возврат сюда, форма восстановится из черновика
  if (!isLoggedIn.value) {
    saveDraft();

    return navigateTo({ name: 'auth', query: { redirect: '/product/create' } });
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
}, onInvalidSubmit);

watch(category, () => {
  if (isRestoringDraft) return;

  subcategory.value = '';
  brand.value = '';
  attributes.value = {};
});

watch(subcategory, () => {
  if (isRestoringDraft) return;

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
      <div class="flex items-center gap-2 rounded-2xl border border-default bg-default px-5 py-3">
        <template
          v-for="(label, index) in WIZARD_STEPS"
          :key="label"
        >
          <div
            v-if="index"
            class="h-px flex-1 bg-accented"
          />

          <div class="flex items-center gap-1.5">
            <span
              class="flex size-6 items-center justify-center rounded-full text-xs font-semibold"
              :class="step > index ? 'bg-primary text-inverted' : 'bg-elevated text-muted'"
              v-text="index + 1"
            />

            <span
              class="text-xs"
              :class="step === index + 1 ? 'font-medium text-highlighted' : 'text-muted'"
              v-text="label"
            />
          </div>
        </template>
      </div>

      <div
        v-if="step === 1"
        class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden"
      >
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
        v-if="step === 3"
        v-model="attributes"
        :fields="attributeFields"
      />

      <div
        v-if="step === 3"
        class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden"
      >
        <div class="px-5 py-4">
          <UFormField
            label="Nome do produto"
            help="O nome não deve exceder os 70 caracteres."
            :error="errors.productName"
            name="productName"
            required
          >
            <UInput
              v-model="productName"
              name="productName"
              type="text"
              placeholder="Nome curto e claro do produto"
              maxlength="70"
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

      <div
        v-if="step === 2"
        class="rounded-2xl border border-default bg-default p-5 space-y-4"
      >
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
        v-if="isLastStep && hasAPIError"
        color="error"
        variant="soft"
        title="Não foi possível criar o anúncio"
        :description="apiErrorMessage"
      />

      <div class="flex gap-2">
        <UButton
          v-if="step > 1"
          type="button"
          color="neutral"
          variant="soft"
          size="lg"
          icon="i-lucide-arrow-left"
          label="Voltar"
          class="flex-1"
          @click="goBack"
        />

        <UButton
          v-if="!isLastStep"
          type="button"
          color="primary"
          size="lg"
          trailingIcon="i-lucide-arrow-right"
          label="Continuar"
          class="flex-1"
          @click="goNext"
        />

        <UButton
          v-else
          type="submit"
          color="primary"
          size="lg"
          :loading="isLoading"
          label="Publicar anúncio"
          class="flex-1"
        />
      </div>

      <p
        v-if="isLastStep && !isLoggedIn"
        class="text-center text-xs text-muted"
      >
        Para publicar, você fará login no próximo passo — o anúncio fica guardado.
      </p>

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
