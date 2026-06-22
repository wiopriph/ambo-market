<script setup lang="ts">
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


const props = defineProps<{
  value: number;
  max: number;
}>();

const emit = defineEmits<{ input: [page: number] }>();
</script>

<template>
  <UPagination
    :page="props.value"
    :total="max * MAX_POSTS_PER_PAGE"
    :itemsPerPage="MAX_POSTS_PER_PAGE"
    @update:page="emit('input', $event)"
  />
</template>
