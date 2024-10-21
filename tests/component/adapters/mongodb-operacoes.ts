import { UserOrderDocument } from "../../../src/infrastructure/database/models/OrderModel";
import { collection, database } from "./mongodb-connector";

export const clearCollections = async () => {
  const collections = await database.collections();

  await Promise.all(collections.map((collection) => collection.deleteMany({})));
};

export const consultaPedidoUsuario = (order_id: string) => {
  return collection.findOne<UserOrderDocument>({
    "orders.order_id": order_id,
  });
};
