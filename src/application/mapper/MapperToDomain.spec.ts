import { MapperApplicationToDomain } from "./MapperToDomain";
import { UserOrderDTO } from "../services/file/FileService";
import { UserOrder } from "../../domain/entities/OrderBuilder";

describe("MapperApplicationToDomain", () => {
  it("should map UserOrderDTO to UserOrder", () => {
    const userOrderDTO: UserOrderDTO = {
      user_id: 1,
      name: "John Doe",
      order_id: 123,
      date: "2023-10-01",
      product_id: 1,
      value: "100.00",
    };

    const userOrder: UserOrder =
      MapperApplicationToDomain.execute(userOrderDTO);

    expect(userOrder).toEqual({
      user_id: 1,
      name: "John Doe",
      orders: [
        {
          order_id: 123,
          total: "100.00",
          date: new Date("2023-10-01"),
          products: [
            {
              product_id: 1,
              value: "100.00",
            },
          ],
        },
      ],
    });
  });
});
