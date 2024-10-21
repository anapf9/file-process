export interface Product {
  product_id: number;
  value: string;
}

export interface Order {
  order_id: number;
  total: string;
  date: Date;
  products: Product[];
}

export interface UserOrder {
  user_id: number;
  name: string;
  orders: Order[];
}
