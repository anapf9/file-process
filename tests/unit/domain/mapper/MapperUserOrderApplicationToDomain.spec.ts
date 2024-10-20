import { MapperUserOrderApplicationToDomain } from "../../../../src/domain/mapper/MapperUserOrderApplicationToDomain";
import { UserOrderDTO } from "../../../../src/application/services/file/FileService";
import { UserOrder } from "../../../../src/domain/entities/OrderBuilder";

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
      MapperUserOrderApplicationToDomain.execute(userOrderDTO);

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
