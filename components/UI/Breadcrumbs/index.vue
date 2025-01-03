<script lang="ts" setup>
import type { Props } from './types';


const props = defineProps<Props>();
const router = useRouter();
const config = useRuntimeConfig();

const breadcrumbsMicrodata = computed(() =>
  props.items.map((item, index) => {
    const crumb = {
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
    };

    if (item.to) {
      const resolvedRoute = router.resolve(item.to);

      if (resolvedRoute && resolvedRoute.href) {
        crumb.item = `${config.public.appBaseUrl}${resolvedRoute.href}`;
      }
    }

    return crumb;
  }),
);

if (!props.disableMicrodata) {
  useHead({
    script: computed(() => [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbsMicrodata.value,
        }),
      },
    ]),
  });
}
</script>

<template>
  <nav :class="$style.root">
    <span
      v-for="(item, index) in items"
      :key="index"
      :class="$style.item"
    >
      <NuxtLink
        v-if="item.to"
        :key="`route_${index}`"
        :to="item.to"
        :class="$style.link"
      >
        <span>{{ item.title }}</span>
      </NuxtLink>

      <span
        v-else
        :key="`simple_${index}`"
      >
        {{ item.title }}
      </span>
    </span>
  </nav>
</template>


<style lang="scss" module>
.root {
  @include ui-typo-14;
  display: inline-block;
  padding: 8px 0;
}

.item {
  word-break: break-word;

  &:not(:last-child)::after {
    margin: 0 10px;
    color: $ui-color-text-main;
    content: '›';
  }
}

.link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
