type Location = {
  lon: number;
  lat: number;
  displayName: string;
  city: string;
};

export type Post = {
  id: string;
  createdAt: number;
  price: number;
  searchBy: string;
  description: string;
  isSafeDeal: boolean;
  title: string;
  userId: string;
  categoryId: string;
  status: 'open' | 'closed' | 'archived';
  location: Location;
  images: string[];
};

export type User = {
  id: string;
  creationTime: string;
  emailVerified: boolean;
  name: string;
  phone?: string;
  photoURL: string;
  disabled: boolean;
  rating: number;
};

export type ProductApiResponse = {
  post: Post;
  user: User;
};
