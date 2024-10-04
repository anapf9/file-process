import { OrderModel } from "../database/models/OrderModel";
import { UserOrder } from "../../domain/entities/OrderBuilder";
import { IOrderOperations } from "../../domain/interfaces/DBOperationsPort";

export class OrderRepository implements IOrderOperations {
  async findByUserId(user_id: number): Promise<UserOrder | null> {
    return OrderModel.findOne({ user_id }).exec();
  }

  async save(userOrder: UserOrder): Promise<UserOrder> {
    return new OrderModel(userOrder).save();
  }

  async update(userOrder: UserOrder): Promise<UserOrder | null> {
    return OrderModel.findOneAndUpdate(
      { user_id: userOrder.user_id },
      userOrder,
      { new: true }
    ).exec();
  }

  async findAll(): Promise<UserOrder[]> {
    return OrderModel.find().exec();
  }

  async findOrderID(order_id: number): Promise<UserOrder[]> {
    console.log("filters", order_id);

    return OrderModel.find({ "orders.order_id": order_id }).exec();
  }

  async findOrdersWithinDateRange(startDate: Date, endDate: Date) {
    try {
      const results = await OrderModel.aggregate([
        { $unwind: "$orders" },
        {
          $match: {
            "orders.date": { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$_id",
            user_id: { $first: "$user_id" },
            name: { $first: "$name" },
            orders: { $push: "$orders" },
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  }

  //private mapperModelToDomain() {}
}
