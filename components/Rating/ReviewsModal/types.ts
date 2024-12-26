export interface Review {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  product: {
    id: string;
    name: string;
  };
  createdAt: number;
  rating: number;
  message: string;
}

export interface RatingReviewsResponse {
  rating: number | null;
  reviews: Review[];
}

export interface RatingReviewsModalProps {
  userId: string;
}

