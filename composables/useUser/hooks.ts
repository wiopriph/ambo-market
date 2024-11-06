import type { ProfileUpdateData } from './types';


export default function useUserApi() {
  // const { $fire } = useNuxtApp();

  const GET_USER = async () => {
    try {
      return await new Promise((resolve) => {
        // eslint-disable-next-line no-console
        console.log('GET_USER');
        setTimeout(resolve, 1_000);
      });

      // const response = await $fire.functions.httpsCallable('getUser')();
      // return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const UPDATE_USER = async (params: ProfileUpdateData) => {
    try {
      return await new Promise((resolve) => {
        // eslint-disable-next-line no-console
        console.log(params);
        setTimeout(resolve, 1_000);
      });

      // const response = await $fire.functions.httpsCallable('updateUser')(params);
      // return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const ADD_POST_TO_FAVORITE = async (postId: string) => {
    try {
      return await new Promise((resolve) => {
        // eslint-disable-next-line no-console
        console.log(postId);
        setTimeout(resolve, 1_000);
      });

      // const response = await $fire.functions.httpsCallable('addPostToFavorite')({ postId });
      // return response.data?.favoritePosts || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const REMOVE_POST_FROM_FAVORITE = async (postId: string) => {
    try {
      return await new Promise((resolve) => {
        // eslint-disable-next-line no-console
        console.log(postId);
        setTimeout(resolve, 1_000);
      });

      // const response = await $fire.functions.httpsCallable('removePostFromFavorite')({ postId });
      // return response.data?.favoritePosts || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    GET_USER,
    UPDATE_USER,
    ADD_POST_TO_FAVORITE,
    REMOVE_POST_FROM_FAVORITE,
  };
}
