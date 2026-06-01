<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router';


interface CategoryCard {
  title: string;
  icon?: string;
  route: RouteLocationRaw;
}

export interface CategoryPillsProps {
  list: CategoryCard[];
}


const props = defineProps<CategoryPillsProps>();
</script>

<template>
  <nav
    v-if="props.list?.length"
    aria-label="Category navigation"
  >
    <div class="flex flex-wrap gap-2 sm:gap-2">
      <UButton
        v-for="category in props.list"
        :key="category.title"
        :to="category.route"
        color="neutral"
        variant="soft"
        class="group justify-start rounded-full border border-default bg-default/80 px-3 py-2"
      >
        <span
          v-if="category.icon"
          class="flex size-6 shrink-0 items-center justify-center rounded-full text-primary"
        >
          <UIcon
            :name="category.icon"
            class="size-4"
          />
        </span>

        <span
          class="max-w-[200px] truncate text-sm font-medium text-highlighted"
          v-text="category.title"
        />
      </UButton>
    </div>
  </nav>
</template>
