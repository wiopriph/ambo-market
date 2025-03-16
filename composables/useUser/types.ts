export interface User {
  id: string;
  creationTime: string;
  emailVerified: boolean;
  name: string;
  email: string;
  photoURL: string;
  disabled: boolean;
  rating?: number;
  phone?: string;
  isAdmin?: boolean;
  favoritePosts?: string[];
}

export interface ProfileUpdateData {
  displayName?: string;
  image?: string;
  email?: string;
  phoneNumber?: string;
}

export interface FavoritePostsResponse {
  favoritePosts: string[];
  success: boolean;
}
