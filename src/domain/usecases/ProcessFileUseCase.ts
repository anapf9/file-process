import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";
import { UserOrderDTO } from "../../application/services/FileService";
import {
  ProductBuilder,
  OrderBuilder,
  UserOrderBuilder,
  Order,
  UserOrder,
} from "../entities/OrderBuilder";
import { IProcessFileUseCase } from "../interfaces/usecases/IProcessFileUsecase";

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

      const newRegister = this.mapperToDomain(userOrder);

      if (!existingUserOrder) {
        await this.orderRepository.save(newRegister);
        return;
      }

      const updatedUserOrder = this.updateExistingOrder(
        existingUserOrder,
        newRegister
      );

      await this.orderRepository.update(updatedUserOrder);
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  }

  private mapperToDomain(user: UserOrderDTO): UserOrder {
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

  private updateExistingOrder(
    existingUserOrder: UserOrder,
    newUserOrder: UserOrder
  ): UserOrder {
    const existingUserOrderBuilder = new UserOrderBuilder()
      .setUserId(existingUserOrder.user_id)
      .setName(existingUserOrder.name);

    existingUserOrder.orders.forEach((order) =>
      existingUserOrderBuilder.addOrder(order)
    );

    const newOrder = newUserOrder.orders[0];
    const existingOrderIndex = existingUserOrder.orders.findIndex(
      (order) => order.order_id === newOrder.order_id
    );

    if (existingOrderIndex !== -1) {
      const existingOrder = existingUserOrder.orders[existingOrderIndex];
      this.handlerExistingOrder(newOrder, existingOrder);
      existingUserOrder.orders[existingOrderIndex] = existingOrder;
    } else {
      existingUserOrderBuilder.addOrder(newOrder);
    }

    return existingUserOrderBuilder.build();
  }

  private handlerExistingOrder(newOrder: Order, existingOrder: Order) {
    const newProduct = newOrder.products[0];
    const existingProduct = existingOrder.products.find(
      (product) => product.product_id === newProduct.product_id
    );

    if (existingProduct) {
      console.warn(
        `Product already exists for product_id ${newProduct.product_id} of order ${newOrder.order_id}.`
      );
      return;
    }

    existingOrder.products.push(newProduct);
    existingOrder.total = this.totalProductsOfOrder(
      existingOrder.total,
      newProduct.value
    );
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
