<script setup lang="ts">
definePageMeta({
  path: '/:cityId/:categoryId/:subcategoryId/:brandId/:productId([A-Za-z0-9_-]{20}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
});
</script>

<template>
  <ProductPage breadcrumbDepth="brand" />
</template>
