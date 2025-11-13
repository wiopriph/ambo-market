export interface Point {
  name: string;
  address: string;
  openingHours: string;
  phone: string;
}

export interface OrderPointCardProps {
  point: Point;
}
