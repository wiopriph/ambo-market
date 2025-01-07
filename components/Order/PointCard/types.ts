interface Location {
  city: string,
  lat: number,
  lon: number,
}

export interface Point {
  name: string;
  address: string;
  location: Location;
  openingHours: string;
  phone: string;
}

export interface OrderPointCardProps {
  point: Point;
}
