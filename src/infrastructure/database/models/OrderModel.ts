import mongoose, { Schema, Document, Types } from "mongoose";
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

export type UserOrderDocument = UserOrder & Document<Types.ObjectId>;
export type OrderDocument = Order & Document<Types.ObjectId>;
export type ProductDocument = Product & Document<Types.ObjectId>;

const ProductSchema = new Schema<ProductDocument>({
  product_id: { type: Number, required: true },
  value: { type: String, required: true },
});

const OrderSchema = new Schema<OrderDocument>({
  order_id: { type: Number, required: true },
  total: { type: String, required: true },
  date: { type: Date, required: true },
  products: [ProductSchema],
});

export const UserOrderSchema = new Schema<UserOrderDocument>({
  user_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  orders: [OrderSchema],
});

export const OrderModel = mongoose.model<UserOrderDocument>(
  "UserOrder",
  UserOrderSchema
);
