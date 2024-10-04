import { UserOrderDTO } from "../services/FileService";
import {
  OrderBuilder,
  ProductBuilder,
  UserOrder,
  UserOrderBuilder,
} from "../../domain/entities/OrderBuilder";

export class MapperApplicationToDomain {
  static execute(user: UserOrderDTO): UserOrder {
    const product = new ProductBuilder()
      .setProductId(user.product_id)
      .setValue(user.value)
      .build();

    const order = new OrderBuilder()
      .setOrderId(user.order_id)
      .setTotal(user.total)
      .setDate(new Date(user.date))
      .addProduct(product)
      .build();

    return new UserOrderBuilder()
      .setUserId(user.user_id)
      .setName(user.name)
      .addOrder(order)
      .build();
  }
}
