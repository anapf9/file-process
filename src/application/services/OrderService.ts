import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";
import { UserOrder } from "../../domain/entities/OrderBuilder";
import { QueryStringRequestDTO } from "../controllers/OrderController";

export class OrderService {
  //private readonly orderRepository: OrderRepository =
  //  Container.get(OrderRepository);
  constructor(
    @Inject
    private readonly orderRepository: OrderRepository
  ) {}

  async getOrders(filters: QueryStringRequestDTO): Promise<UserOrder[]> {
    if (
      filters.init_date !== undefined ||
      filters.last_date !== undefined ||
      filters.order_id !== undefined
    ) {
      if (filters.order_id && filters.order_id.length > 0) {
        return this.orderRepository.findOrderID(Number(filters.order_id));
      }

      if (
        filters.init_date &&
        filters.init_date.length > 0 &&
        filters.last_date &&
        filters.last_date
      ) {
        return this.orderRepository.findOrdersWithinDateRange(
          new Date(filters.init_date),
          new Date(filters.last_date)
        );
      }

      console.log("fazer a validação correta dos dados via Joi");
    }
    return this.orderRepository.findAll();
  }
}
