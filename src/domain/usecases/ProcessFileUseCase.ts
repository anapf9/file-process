import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";
import { UserOrderDTO } from "../../application/services/file/FileService";
import {
  OrderBuilder,
  UserOrderBuilder,
  Order,
  UserOrder,
} from "../entities/OrderBuilder";
import { IProcessFileUseCase } from "../interfaces/usecases/IProcessFileUsecase";
import { MapperUserOrderApplicationToDomain } from "../mapper/MapperUserOrderApplicationToDomain";

export class ProcessFileUseCase implements IProcessFileUseCase {
  constructor(
    @Inject
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(userOrder: UserOrderDTO): Promise<void> {
    try {
      const existingUserOrder = await this.orderRepository.findByUserId(
        userOrder.user_id
      );

      const newRegister = MapperUserOrderApplicationToDomain.execute(userOrder);

      if (!existingUserOrder) {
        await this.orderRepository.save(newRegister);
        return;
      }

      const updatedUserOrder = this.updateExistingOrder(
        existingUserOrder,
        newRegister
      );

      console.log("a", JSON.stringify(updatedUserOrder));

      await this.orderRepository.update(updatedUserOrder);
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  }

  private updateExistingOrder(
    existingUserOrder: UserOrder,
    newUserOrder: UserOrder
  ): UserOrder {
    const userOrderToUpdate = new UserOrderBuilder()
      .setUserId(existingUserOrder.user_id)
      .setName(existingUserOrder.name);

    const updatedOrders = existingUserOrder.orders.map((order) => {
      if (order.order_id === newUserOrder.orders[0].order_id) {
        return this.handlerExistingOrder(newUserOrder.orders[0], order);
      }
      return order;
    });

    const newOrder = newUserOrder.orders[0];
    const orderExists = updatedOrders.some(
      (order) => order.order_id === newOrder.order_id
    );

    if (!orderExists) {
      updatedOrders.push(newOrder);
    }

    updatedOrders.forEach((order) => userOrderToUpdate.addOrder(order));

    return userOrderToUpdate.build();
  }

  private handlerExistingOrder(newOrder: Order, existingOrder: Order): Order {
    const newProduct = newOrder.products[0];
    const existingProduct = existingOrder.products.find(
      (product) => product.product_id === newProduct.product_id
    );

    if (existingProduct) {
      console.warn(
        `Product already exists for product_id ${newProduct.product_id} of order ${newOrder.order_id}.`
      );
      return existingOrder;
    }

    const updatedProducts = [...existingOrder.products, newProduct];
    const updatedTotal = this.totalProductsOfOrder(
      existingOrder.total,
      newProduct.value
    );

    return new OrderBuilder()
      .setOrderId(existingOrder.order_id)
      .setTotal(updatedTotal)
      .setDate(existingOrder.date)
      .addProducts(updatedProducts)
      .build();
  }

  private totalProductsOfOrder(str1: string, str2: string): string {
    const num1 = Number(str1);
    const num2 = Number(str2);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Uma ou ambas as entradas não são números válidos.");
    }

    const result = num1 + num2;
    return result.toString();
  }
}
