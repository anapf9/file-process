import { OrderService } from "./OrderService";
import { OrderRepository } from "../../../infrastructure/repository/OrderRepository";
import { QueryStringRequestDTO } from "../../controllers/OrderController";
import { mock } from "jest-mock-extended";
import { UserOrder } from "../../../domain/entities/OrderBuilder";

describe("OrderService", () => {
  let orderService: OrderService;
  const orderRepository = mock<OrderRepository>();

  const mockOrders: UserOrder[] = [
    {
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
              value: "50.00",
            },
            {
              product_id: 2,
              value: "50.00",
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    orderRepository.findOrderID.mockResolvedValue(mockOrders);
    orderService = new OrderService(orderRepository);
  });

  it("should get orders with filters", async () => {
    const filters: QueryStringRequestDTO = { order_id: "123" };

    const orders = await orderService.getOrders(filters);

    expect(orderRepository.findOrderID).toHaveBeenCalledWith(123);
    expect(orders).toEqual(mockOrders);
  });
});
