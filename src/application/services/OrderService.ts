import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";
import { Order, UserOrder } from "../../domain/entities/OrderBuilder";
import { QueryStringRequestDTO } from "../controllers/OrderController";

export class OrderService {
  constructor(
    @Inject
    private readonly orderRepository: OrderRepository
  ) {}

  async getOrders(filters: QueryStringRequestDTO): Promise<UserOrder[]> {
    const existFilters =
      filters.init_date !== undefined ||
      filters.last_date !== undefined ||
      filters.order_id !== undefined;

    if (existFilters) {
      return await this.withFilters(filters);
    }
    return await this.orderRepository.findAll();
  }

  private async withFilters(filters: QueryStringRequestDTO) {
    if (filters.order_id && filters.order_id.length > 0) {
      const usersOrdersFound = await this.orderRepository.findOrderID(
        Number(filters.order_id)
      );

      const resultFilter: UserOrder[] = usersOrdersFound.map((userOrder) => {
        const orders: Order[] = [];

        userOrder.orders.forEach((order) => {
          if (order.order_id === Number(filters.order_id)) {
            console.log("match", order.order_id, order);

            orders.push(order);
          }
        });

        return {
          ...userOrder,
          orders,
        };
      });

      console.log(JSON.stringify(resultFilter));

      return resultFilter;
    }

    if (
      filters.init_date &&
      filters.init_date.length > 0 &&
      filters.last_date &&
      filters.last_date.length > 0
    ) {
      return await this.orderRepository.findOrdersWithinDateRange(
        new Date(filters.init_date),
        new Date(filters.last_date)
      );
    }

    console.log("fazer a validação correta dos dados via Joi");

    return [];
  }
}
