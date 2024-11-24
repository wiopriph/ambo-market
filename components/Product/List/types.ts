import type { Post } from '~/composables/usePosts/types';


export interface ListProps {
  list?: Post[],
  isLoading?: boolean,
  emptyTitle?: string,
  emptyText?: string,
}
