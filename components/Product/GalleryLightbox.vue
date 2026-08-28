<script setup lang="ts">
type LightboxImage = {
  url: string
  alt: string
};

const props = withDefaults(defineProps<{
  open: boolean
  images: LightboxImage[]
  startIndex?: number
}>(), {
  startIndex: 0,
});

const emit = defineEmits<{
  'update:open': [open: boolean]
  select: [index: number]
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
});

const currentIndex = ref(0);

// Зум одной ступенью (1×/2×) — надёжнее жестов: тап приближает, тап возвращает,
// панорамирование через нативный скролл контейнера
const ZOOM_SCALE = 2;
const isZoomed = ref(false);
const zoom = computed(() => isZoomed.value ? ZOOM_SCALE : 1);

watch(
  () => props.open,
  (opened) => {
    if (opened) {
      currentIndex.value = Math.min(Math.max(props.startIndex, 0), props.images.length - 1);
      isZoomed.value = false;
    }
  },
);

const currentImage = computed(() => props.images[currentIndex.value] || null);

const showImage = (index: number) => {
  const total = props.images.length;

  currentIndex.value = (index + total) % total;
  isZoomed.value = false;
  emit('select', currentIndex.value);
};

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};
</script>

<template>
  <UModal
    v-model:open="isOpen"
    fullscreen
    :ui="{ content: 'bg-black' }"
  >
    <template #content>
      <div class="relative flex h-full flex-col bg-black">
        <div class="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
          <span
            v-if="images.length > 1"
            class="rounded-full bg-black/40 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur"
          >
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>

          <span v-else />

          <div class="flex items-center gap-2">
            <UButton
              :icon="isZoomed ? 'i-lucide-zoom-out' : 'i-lucide-zoom-in'"
              :aria-label="isZoomed ? 'Reduzir' : 'Ampliar'"
              color="neutral"
              variant="soft"
              class="rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/55"
              @click="toggleZoom"
            />

            <UButton
              icon="i-lucide-x"
              aria-label="Fechar"
              color="neutral"
              variant="soft"
              class="rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/55"
              @click="isOpen = false"
            />
          </div>
        </div>

        <div
          v-if="currentImage"
          class="min-h-0 flex-1 overflow-auto overscroll-contain"
        >
          <img
            v-if="isZoomed"
            :src="currentImage.url"
            :alt="currentImage.alt"
            :style="{ width: `${zoom * 100}%` }"
            class="max-w-none cursor-zoom-out"
            @click="toggleZoom"
          >

          <img
            v-else
            :src="currentImage.url"
            :alt="currentImage.alt"
            class="h-full w-full cursor-zoom-in object-contain"
            @click="toggleZoom"
          >
        </div>

        <template v-if="images.length > 1 && !isZoomed">
          <UButton
            icon="i-lucide-chevron-left"
            aria-label="Foto anterior"
            color="neutral"
            variant="soft"
            size="lg"
            class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/55"
            @click="showImage(currentIndex - 1)"
          />

          <UButton
            icon="i-lucide-chevron-right"
            aria-label="Próxima foto"
            color="neutral"
            variant="soft"
            size="lg"
            class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/55"
            @click="showImage(currentIndex + 1)"
          />

          <div class="absolute inset-x-0 bottom-4 flex justify-center">
            <div class="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-2 backdrop-blur">
              <button
                v-for="(dotImage, dotIndex) in images"
                :key="dotIndex"
                :aria-label="`Foto ${dotIndex + 1}`"
                :class="dotIndex === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'"
                type="button"
                class="h-1.5 rounded-full transition-all"
                @click="showImage(dotIndex)"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
