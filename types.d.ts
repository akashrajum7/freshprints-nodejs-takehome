export interface Apparel {
  stock: number;
  quality: number; // 0 - 5
  price: number;
  code: string;
  size: string;
}

export interface Order {
  code: string;
  size: string;
  quantity: number;
  quality: number;
}
