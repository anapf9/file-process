import { QueryStringRequestDTO } from "../../../application/controllers/OrderController";
import { UserOrder } from "../../../domain/entities/OrderBuilder";

export abstract class IGetOrdersUseCase {
  abstract execute(filters: QueryStringRequestDTO): Promise<UserOrder[]>;
}
