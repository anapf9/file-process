import { OrderModel, UserOrderDocument } from "../database/models/OrderModel";
import {
  UserOrder,
  UserOrderBuilder,
} from "../../domain/entities/OrderBuilder";
import { IOrderRepository } from "../../domain/interfaces/DBOperationsPort";

export class OrderRepository implements IOrderRepository {
  async findByUserId(user_id: number): Promise<UserOrder | null> {
    const result = await OrderModel.findOne({ user_id }).exec();
    return result && this.mapperModelToDomain(result);
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
    return await OrderModel.find().exec();
  }

  async findOrderID(order_id: number): Promise<UserOrder[]> {
    const results = await OrderModel.find({
      "orders.order_id": order_id,
    }).exec();

    return results.map((result) => this.mapperModelToDomain(result));
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

      return results.map((result) => this.mapperModelToDomain(result));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  }

  private mapperModelToDomain(model: UserOrderDocument): UserOrder {
    const userMapped = new UserOrderBuilder()
      .setUserId(model.user_id)
      .setName(model.name);

    model.orders.forEach((order) =>
      userMapped.addOrder({
        order_id: order.order_id,
        total: order.total,
        date: order.date,
        products: order.products.map((product) => ({
          product_id: product.product_id,
          value: product.value,
        })),
      })
    );

    return userMapped.build();
  }
}
