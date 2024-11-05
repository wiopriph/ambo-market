import type { FetchPostsParams } from './types';


export default function usePostApi() {
  // const { $fire } = useNuxtApp();

  const GET_POSTS = async (params: FetchPostsParams) => {
    try {
      return await new Promise((resolve) => {
        // eslint-disable-next-line no-console
        console.log(params);
        setTimeout(resolve, 1_000);
      });

      // const response = await $fire.functions.httpsCallable('getPosts')(params);
      // return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    GET_POSTS,
  };
}
