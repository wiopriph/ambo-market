interface User {
  id: string;
  name: string;
}

interface Product {
  id: string;
  categoryId: string;
  location: { city: string };
  price: number;
  image: string;
  title: string;
  status: string;
  isSafeDeal: boolean;
}

// @todo: прописать типы Product, User и Message
export interface ChatProductInfoProps {
  user: User;
  product: Product;
}
