import type { Post, User } from '~/types/product';


export interface GalleryModalProps {
  post: Post;
  seller: User;
  currentIndex: number;
  phoneNumber?: string;
  isOwner: boolean;
  isClosePostLoading?: boolean;
}
