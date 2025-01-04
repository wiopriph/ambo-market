import type { User, ProfileUpdateData } from './types';
import useUserApi from '~/composables/useUser/hooks';


export function useUser() {
  const {
    GET_USER,
    UPDATE_USER,
    ADD_POST_TO_FAVORITE,
    REMOVE_POST_FROM_FAVORITE,
  } = useUserApi();

  const isAuthChecking = useState<boolean>('isAuthChecking', () => false);

  const currentUser = useState<User | null>('currentUser', () => null);
  const isLoggedIn = computed(() => !!currentUser.value);
  const uid = computed(() => currentUser.value?.id ?? null);

  const setCurrentUser = (user: User | null) => {
    currentUser.value = user;
  };

  const fetchProfile = async () => {
    try {
      const userInfo = await GET_USER();

      setCurrentUser(userInfo || null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while updating user info:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: ProfileUpdateData) => {
    try {
      const userInfo = await UPDATE_USER(profileData);

      setCurrentUser(userInfo || null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while updating user info:', error);
      throw error;
    }
  };


  const favoritePosts = computed(() => new Set(currentUser.value?.favoritePosts ?? []));

  const isPostInFavorite = (postId: string): boolean => favoritePosts.value.has(postId);

  const togglePostInFavorite = (postId: string) => {
    if (!currentUser.value) {
      return;
    }

    const favPosts = new Set(currentUser.value.favoritePosts || []);

    if (favPosts.has(postId)) {
      favPosts.delete(postId);
    } else {
      favPosts.add(postId);
    }

    currentUser.value = { ...currentUser.value, favoritePosts: Array.from(favPosts) };
  };

  const setFavoritePosts = (posts: string[]) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, favoritePosts: posts };
    }
  };

  const addPostToFavorite = async (postId: string) => {
    togglePostInFavorite(postId);

    try {
      const updatedFavoritePosts = await ADD_POST_TO_FAVORITE(postId);

      if (updatedFavoritePosts) {
        setFavoritePosts(updatedFavoritePosts);
      }
    } catch (error) {
      togglePostInFavorite(postId);
      // eslint-disable-next-line no-console
      console.error('Error while adding post to favorite:', error);
      throw error;
    }
  };

  const removePostFromFavorite = async (postId: string) => {
    togglePostInFavorite(postId);

    try {
      const updatedFavoritePosts = await REMOVE_POST_FROM_FAVORITE(postId);

      if (updatedFavoritePosts) {
        setFavoritePosts(updatedFavoritePosts);
      }
    } catch (error) {
      togglePostInFavorite(postId);
      // eslint-disable-next-line no-console
      console.error('Error while removing post from favorite:', error);
      throw error;
    }
  };

  return {
    isAuthChecking,
    currentUser,
    isLoggedIn,
    uid,
    setCurrentUser,
    fetchProfile,
    updateProfile,
    isPostInFavorite,
    addPostToFavorite,
    removePostFromFavorite,
  };
}
