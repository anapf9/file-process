import { UserOrderDTO } from "../../application/services/file/FileService";
import {
  OrderBuilder,
  ProductBuilder,
  UserOrder,
  UserOrderBuilder,
} from "../entities/OrderBuilder";

export class MapperUserOrderApplicationToDomain {
  static execute(user: UserOrderDTO): UserOrder {
    const product = new ProductBuilder()
      .setProductId(user.product_id)
      .setValue(user.value)
      .build();

    const order = new OrderBuilder()
      .setOrderId(user.order_id)
      .setTotal(user.value)
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
