import { Inject } from "typescript-ioc";
import { OrderRepository } from "../../infrastructure/repository/OrderRepository";

export class GetOrdersUseCase {
  constructor(
    @Inject
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(filters: any): Promise<any> {
    //return this.orderRepository.findByFilters(filters);
  }
}
