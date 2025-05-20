interface User {
  id: string;
  name: string;
  photoUrl?: string;
  phone: string;
  email: string;
}

interface Product {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  location: { city: string };
  price: number;
  preview: string;
  title: string;
  status: string;
  isSafeDeal: boolean;
  isReviewed: boolean;
  buyerId: string;
  userId: string;
}

export interface ChatProductInfoProps {
  user: User;
  product: Product;
}
