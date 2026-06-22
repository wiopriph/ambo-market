<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';


interface BreadcrumbItem {
  title: string;
  to?: RouteLocationRaw;
}

interface Props {
  items: BreadcrumbItem[];
  disableMicrodata?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();
const config = useRuntimeConfig();

const breadcrumbItems = computed(() =>
  props.items.map(item => ({ label: item.title, to: item.to })),
);

const script = computed(() => [{
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, index) => {
      const crumb: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
      };

      if (item.to) {
        const resolved = router.resolve(item.to);

        if (resolved?.href) crumb.item = `${config.public.appBaseUrl}${resolved.href}`;
      }

      return crumb;
    }),
  }),
}]);

if (!props.disableMicrodata) {
  useHead({ script: script.value });
}
</script>

<template>
  <UBreadcrumb :items="breadcrumbItems" />
</template>
