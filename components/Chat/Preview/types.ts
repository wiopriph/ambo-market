interface User {
  id: string;
  name?: string;
  photoUrl?: string;
}

interface Product {
  image?: string;
  title: string;
}

interface Message {
  id: string;
  timestamp: number;
  text: string;
}

// @todo: прописать типы Product, User и Message
export interface ChatPreviewProps {
  isActive: boolean,
  unreadCount: number,

  product: Product;
  user: User;
  message?: Message;
}
