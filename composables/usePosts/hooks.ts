import type { FetchPostsParams, PostsResponse } from './types';


export default function usePostApi() {
  const { $fire } = useNuxtApp();

  const GET_POSTS = async (params: FetchPostsParams) => {
    const response = await $fire.https('getPosts', params);

    return response?.data as PostsResponse;
  };

  return {
    GET_POSTS,
  };
}
