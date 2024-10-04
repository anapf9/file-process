import { OrderModel, UserOrderDocument } from "../database/models/OrderModel";
import {
  OrderBuilder,
  ProductBuilder,
  UserOrder,
  UserOrderBuilder,
} from "../../domain/entities/OrderBuilder";
import { IOrderOperations } from "../../domain/interfaces/DBOperationsPort";
import { Model } from "mongoose";

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
    return await OrderModel.find().exec();
  }

  async findOrderID(order_id: number): Promise<UserOrder[]> {
    console.log("filters", order_id);

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

      return results;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  }

  private mapperModelToDomain(model: UserOrderDocument): UserOrder {
    const userMapped = new UserOrderBuilder()
      .setUserId(model.user_id)
      .setName(model.name);

    model.orders.forEach((order) => userMapped.addOrder(order));

    // const mapped = model.orders.map((order) => {
    //   new OrderBuilder()
    //     .setOrderId(order.order_id)
    //     .setTotal(order.total)
    //     .setDate(new Date(order.date))
    //     .build();

    //   order.products.forEach((product) =>
    //     new ProductBuilder()
    //       .setProductId(product.product_id)
    //       .setValue(product.value)
    //       .build()
    //   );
    // });

    return userMapped.build();
  }
}
