export interface User {
  id: string;
  creationTime: string;
  emailVerified: boolean;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  disabled: boolean;
  rating: number;
  activeChats: string[];
  favoritePosts: string[];
}

export interface ProfileUpdateData {
  displayName: string;
  image: string;
  email: string;
  phoneNumber: string;
}
