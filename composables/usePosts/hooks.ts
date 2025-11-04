import type { FetchPostsParams, PostsResponse } from './types';


export default function usePostApi() {
  const GET_POSTS = (params: FetchPostsParams) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== '',
      ),
    );

    return $fetch<PostsResponse>('/api/posts/search', { params: cleanParams });
  };

  return {
    GET_POSTS,
  };
}
