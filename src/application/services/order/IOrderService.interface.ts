import { UserOrder } from "../../../domain/entities/OrderBuilder";
import { QueryStringRequestDTO } from "../../controllers/OrderController";

export abstract class IOrderService {
  abstract execute(filters: QueryStringRequestDTO): Promise<UserOrder[]>;
}
