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
  rating: number,
}

interface PostByIdResponse {
  post: Post;
  user: User;
}

definePageMeta({
  middleware: defineNuxtRouteMiddleware(async (to) => {
    const { $fire } = useNuxtApp();

    try {
      const response = await $fire.https('getPostById', { postId: to.params.productId });

      const { post } = response as PostByIdResponse;

      const route = getPostRoute({
        oldCategoryId: post.oldCategoryId,

        productId: post.id,
        categoryId: post.categoryId,
        cityId: getCityIdByName(post.location?.city),
      });

      return navigateTo(route);
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
