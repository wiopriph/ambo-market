interface Order {
  id: string; // Уникальный идентификатор заказа
  orderId: string; // Идентификатор заказа для маршрутов
  price: number; // Цена заказа
  seller: {
    id: string; // Уникальный идентификатор продавца
    name: string; // Имя продавца
  };
  buyer: {
    id: string; // Уникальный идентификатор покупателя
    name: string; // Имя покупателя
  };
  post: {
    image: string; // URL изображения товара
    title: string; // Название товара
  };
  messages: {
    seller: string; // Статус сообщения от продавца
    buyer: string; // Статус сообщения от покупателя
  };
  createdAt: string; // Дата создания заказа в ISO формате
  updatedAt?: string; // Дата последнего обновления заказа (опционально)
}


export interface OrderCardProps {
  order: Order;
}
