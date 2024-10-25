import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";
import { UserOrderDTO } from "../../application/services/file/FileService";
import {
  UserOrderBuilder,
  UserOrder,
  Order,
  OrderBuilder,
  ProductBuilder,
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

      if (!existingUserOrder) {
        const newRegister =
          MapperUserOrderApplicationToDomain.execute(userOrder);

        await this.orderRepository.save(newRegister);
        return;
      }

      const updatedUserOrder = this.updateExistingOrder(
        existingUserOrder,
        userOrder
      );

      await this.orderRepository.update(updatedUserOrder);
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  }

  private updateExistingOrder(
    existingUserOrder: UserOrder,
    newUserOrder: UserOrderDTO
  ): UserOrder {
    const userOrderToUpdate = new UserOrderBuilder()
      .setUserId(existingUserOrder.user_id)
      .setName(existingUserOrder.name);

    const existingOrdersMap = new Map(
      existingUserOrder.orders.map((order) => [order.order_id, order])
    );

    const existingOrder = existingOrdersMap.get(newUserOrder.order_id);

    if (existingOrder) {
      const productToUpdate = this.handleExistingOrder(
        existingOrder,
        newUserOrder
      );

      existingOrdersMap.set(existingOrder.order_id, productToUpdate);
    } else {
      const product = new ProductBuilder()
        .setProductId(newUserOrder.product_id)
        .setValue(newUserOrder.value)
        .build();

      const orderToAdd = new OrderBuilder()
        .setOrderId(newUserOrder.order_id)
        .setTotal(newUserOrder.value)
        .setDate(new Date(newUserOrder.date))
        .addProduct(product)
        .build();

      existingOrdersMap.set(newUserOrder.order_id, orderToAdd);
    }

    const updatedOrders = [...existingOrdersMap.values()];

    userOrderToUpdate.addOrders(updatedOrders);

    return userOrderToUpdate.build();
  }

  private handleExistingOrder(
    existingOrder: Order,
    newUserOrder: UserOrderDTO
  ): Order {
    const existingProductsSet = new Set(
      existingOrder.products.map((product) => product.product_id)
    );

    if (existingProductsSet.has(newUserOrder.product_id)) {
      console.warn(
        `Product already exists for product_id ${newUserOrder.product_id} of order ${newUserOrder.order_id}.`
      );

      return existingOrder;
    }
    const product = new ProductBuilder()
      .setProductId(newUserOrder.product_id)
      .setValue(newUserOrder.value)
      .build();

    const productOrderToUpdate = new OrderBuilder()
      .setOrderId(newUserOrder.order_id)
      .setTotal(
        this.totalProductsOfOrder(existingOrder.total, newUserOrder.value)
      )
      .setDate(new Date(newUserOrder.date))
      .addProducts([...existingOrder.products, product])
      .build();

    return productOrderToUpdate;
  }

  private totalProductsOfOrder(str1: string, str2: string): string {
    const num1 = Number(str1);
    const num2 = Number(str2);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Uma ou ambas as entradas não são números válidos.");
    }

    const result = num1 + num2;
    return result.toFixed(2);
  }
}
