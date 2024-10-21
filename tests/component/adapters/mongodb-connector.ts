import { CollectionOptions, Document, MongoClient } from "mongodb";

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

const uri = process.env.MONGODB_CONNECTION_STRING || "";
const mongodbClient = new MongoClient(uri);

export const database = mongodbClient.db("testes");

const collection = database.collection<UserOrder>("userOrders");

export const createCollection = <T extends Document = Document>(
  name: string,
  options?: CollectionOptions | undefined
) => database.collection<T>(name, options);

export { collection, mongodbClient };
