export interface RatingCardProps {
  user: {
    name: string;
    id: string;
    photoURL?: string;
  };
  product: {
    name: string;
  };
  date: number;
  rating: number;
  review: string;
}
