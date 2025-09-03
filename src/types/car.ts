export type Car = {
  id: number;
  title: string;
  price: number;
  currentBid: number;
  timeLeft: string;
  image: string;
  category: string;
  year: number;
  mileage: number;
  location: string;
  watchCount: number;
  bidCount: number;
  description?: string;
  images?: string[];
  specs?: {
    engine: string;
    transmission: string;
    fuelType: string;
    color: string;
    inspection: string;
  };
};

export type BidHistory = {
  id: number;
  bidder: string;
  amount: number;
  time: string;
};
