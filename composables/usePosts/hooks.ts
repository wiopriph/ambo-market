import type { FetchPostsParams, PostsResponse } from './types';


export default function usePostApi() {
  const { $fire } = useNuxtApp();

  const GET_POSTS = async (params: FetchPostsParams) => await $fire.https('getPosts', params) as PostsResponse;

  return {
    GET_POSTS,
  };
}
