// IOrderRepository.ts
import { UserOrder } from "../entities/OrderBuilder";

export abstract class IOrderRepository {
  abstract findByUserId(user_id: number): Promise<UserOrder | null>;
  abstract save(userOrder: UserOrder): Promise<UserOrder>;
  abstract update(userOrder: UserOrder): Promise<UserOrder | null>;
  abstract findAll(): Promise<UserOrder[]>;
  abstract findOrderID(order_id: number): Promise<UserOrder[]>;
  abstract findOrdersWithinDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<UserOrder[]>;
}
