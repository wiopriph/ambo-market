<script setup lang="ts">
import { getCityIdByName } from '~/constants/cities';
import type { Post } from '~/composables/usePosts/types';
import { getPostRoute } from '~/utils/getPostRoute';


interface User {
  id: string,
  creationTime: string,
  emailVerified: string,
  name: string,
  photoURL: string,
  disabled: boolean,
}

interface PostByIdResponse {
  post: Post;
  user: User;
}

definePageMeta({
  middleware: defineNuxtRouteMiddleware(async (to) => {
    try {
      const response = await $fetch<{ post: any; user: any }>(`/api/posts/${to.params.productId}`);

      const { post } = response as PostByIdResponse;

      const route = getPostRoute({
        productId: post?.id,
        brandId: post?.brandId,
        subcategoryId: post?.subcategoryId,
        categoryId: post?.categoryId,
        cityId: getCityIdByName(post.location?.city),
      });

      return navigateTo(route, { redirectCode: 301 });
    } catch (error) {
      if (error?.code === 'functions/not-found') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product data not found',
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load product data',
      });
    }
  }),
});
</script>
