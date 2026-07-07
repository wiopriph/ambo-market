import { useUser } from '~/composables/useUser';


export function useFavorites() {
  const { isLoggedIn } = useUser();
  const supaUser = useSupabaseUser();
  const route = useRoute();

  // массив, а не Set: useState сериализуется в payload при гидрации
  const favoriteIds = useState<string[]>('favoriteIds', () => []);
  const isInitialized = useState<boolean>('favoritesInitialized', () => false);

  const favoriteIdsSet = computed(() => new Set(favoriteIds.value));

  const isFavorite = (postId: string) => favoriteIdsSet.value.has(postId);

  const fetchFavoriteIds = async () => {
    try {
      const { ids } = await $fetch<{ ids: string[] }>('/api/favorites/ids');

      favoriteIds.value = ids;
    } catch (error) {
      console.error('Error while fetching favorite ids:', error);
    }
  };

  const toggleFavorite = async (postId: string) => {
    if (!isLoggedIn.value) {
      navigateTo({ name: 'auth', query: { redirect: route.fullPath } });

      return;
    }

    const wasFavorite = isFavorite(postId);

    // оптимистичное обновление: UI меняется сразу, запрос уходит в фоне
    favoriteIds.value = wasFavorite ?
      favoriteIds.value.filter(id => id !== postId) :
      [...favoriteIds.value, postId];

    try {
      await $fetch(`/api/favorites/${postId}`, {
        method: wasFavorite ? 'DELETE' : 'POST',
      });
    } catch (error) {
      // откат при ошибке
      favoriteIds.value = wasFavorite ?
        [...favoriteIds.value, postId] :
        favoriteIds.value.filter(id => id !== postId);

      console.error('Error while toggling favorite:', error);
    }
  };

  if (import.meta.client && !isInitialized.value) {
    isInitialized.value = true;

    watch(
      supaUser,
      (user) => {
        if (user) {
          fetchFavoriteIds();
        } else {
          favoriteIds.value = [];
        }
      },
      { immediate: true },
    );
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    fetchFavoriteIds,
  };
}
