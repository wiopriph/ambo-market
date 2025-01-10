import type { FetchPostsParams, PostsResponse } from './types';


export default function usePostApi() {
  const { $fire } = useNuxtApp();

  const GET_POSTS = async (params: FetchPostsParams) => await <Promise<PostsResponse>>$fire.https('getPosts', params);

  return {
    GET_POSTS,
  };
}
