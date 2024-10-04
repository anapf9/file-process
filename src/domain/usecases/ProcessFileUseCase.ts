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

      console.log("existingUserOrder", existingUserOrder);

      if (!existingUserOrder) {
        console.log("nao existe", userOrder);

        const salvo = await this.orderRepository.save(newRegister);

        console.log("foi salvo", salvo);

        return;
      }

      const updatedUserOrder = this.updateExistingOrder(
        existingUserOrder,
        newRegister
      );

      console.log("ordem atualizada", updatedUserOrder.orders);

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

    // existingUserOrder.orders.forEach((order) =>
    //   existingUserOrderBuilder.addOrder(order)
    // );

    const newOrder = newUserOrder.orders[0];
    const existingOrder = existingUserOrder.orders.find(
      (order) => order.order_id === newOrder.order_id
    );

    if (existingOrder) {
      console.log("existe a ordem", existingOrder);

      this.handlerExistingOrder(
        newOrder,
        existingOrder,
        existingUserOrderBuilder
      );
    } else {
      console.log("adiciona a nova ordem", newOrder);

      existingUserOrderBuilder.addOrder(newOrder);
    }

    return existingUserOrderBuilder.build();
  }

  private handlerExistingOrder(
    newOrder: Order,
    orderFounded: Order,
    orderToBuild: UserOrderBuilder
  ) {
    const newProduct = newOrder.products[0];
    const existingProduct = orderFounded.products.find(
      (product) => product.product_id === newProduct.product_id
    );

    if (existingProduct) {
      console.warn(
        `Product already exists for product_id ${newProduct.product_id} of order ${newOrder.order_id}. User: ${orderToBuild.getName} - ${orderToBuild.getUserId}`
      );

      return;
    }

    const updatedOrderBuilder = new OrderBuilder()
      .setOrderId(orderFounded.order_id)
      .setTotal(this.totalProductsOfOrder(orderFounded.total, newProduct.value))
      .setDate(orderFounded.date);

    orderFounded.products.forEach((product) =>
      updatedOrderBuilder.addProduct(product)
    );

    updatedOrderBuilder.addProduct(newProduct);

    // Removendo a ordem antiga e adicionando a nova
    orderToBuild.addOrder(updatedOrderBuilder.build());
  }

  private totalProductsOfOrder(str1: string, str2: string): string {
    // Converte as strings para números
    const num1 = Number(str1);
    const num2 = Number(str2);

    // Verifica se a conversão foi bem-sucedida
    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Uma ou ambas as entradas não são números válidos.");
    }

    const result = num1 + num2;

    // Retorna a soma dos números
    return result.toString();
  }
}
