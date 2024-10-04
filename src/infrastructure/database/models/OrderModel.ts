import mongoose, { Schema, Document } from "mongoose";
import { UserOrder } from "../../../domain/entities/OrderBuilder";

interface UserOrderDocument extends UserOrder, Document {}

const ProductSchema = new Schema({
  product_id: { type: Number, required: true },
  value: { type: String, required: true },
});

const OrderSchema = new Schema({
  order_id: { type: Number, required: true },
  total: { type: String, required: true },
  date: { type: Date, required: true },
  products: [ProductSchema],
});

const UserOrderSchema = new Schema({
  user_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  orders: [OrderSchema],
});

export const OrderModel = mongoose.model<UserOrderDocument>(
  "UserOrder",
  UserOrderSchema
);
