import { Inject } from "typescript-ioc";
import { IGetOrdersUseCase } from "../interfaces/usecases/IGetOrdersUsecase";
import { IOrderRepository } from "../interfaces/DBOperationsPort";
import { QueryStringRequestDTO } from "../../application/controllers/OrderController";
import { UserOrder } from "../entities/OrderBuilder";

export class GetOrdersUseCase implements IGetOrdersUseCase {
  constructor(
    @Inject
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute(filters: QueryStringRequestDTO): Promise<UserOrder[]> {
    if (filters.order_id) {
      return this.filterByOrderId(filters.order_id);
    }

    if (filters.init_date && filters.last_date) {
      return this.orderRepository.findOrdersWithinDateRange(
        new Date(filters.init_date),
        new Date(filters.last_date)
      );
    }

    if (filters.init_date || filters.last_date) {
      throw new Error(
        "Para essa regra de negocio deve mandar o intervalo das datas"
      );
    }

    return this.orderRepository.findAll();
  }

  private async filterByOrderId(orderId: string): Promise<UserOrder[]> {
    const usersOrdersFound = await this.orderRepository.findOrderID(
      Number(orderId)
    );
    return usersOrdersFound.map((userOrder) => ({
      ...userOrder,
      orders: userOrder.orders.filter(
        (order) => order.order_id === Number(orderId)
      ),
    }));
  }
}
