import type { ProfileUpdateData } from './types';


export default function useUserApi() {
  const { $fire } = useNuxtApp();

  const GET_USER = async () => {
    try {
      const response = await $fire.https('getUser');

      return response?.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const UPDATE_USER = async (params: ProfileUpdateData) => {
    try {
      const response = await $fire.https('updateUser', params);

      return response?.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const ADD_POST_TO_FAVORITE = async (postId: string) => {
    try {
      const response = await $fire.https('addPostToFavorite', { postId });

      return response?.data?.favoritePosts || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const REMOVE_POST_FROM_FAVORITE = async (postId: string) => {
    try {
      const response = await $fire.https('removePostFromFavorite', { postId });

      return response?.data?.favoritePosts || [];
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
