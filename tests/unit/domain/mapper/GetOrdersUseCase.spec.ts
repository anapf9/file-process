import { mock } from "jest-mock-extended";
import { OrderService } from "../../../../src/application/services/order/OrderService";
import { IOrderRepository } from "../../../../src/domain/interfaces/DBOperationsPort";
import { QueryStringRequestDTO } from "../../../../src/application/controllers/OrderController";
import { UserOrder } from "../../../../src/domain/entities/OrderBuilder";

describe("OrderService", () => {
  let orderService: OrderService;
  const mockOrderRepository = mock<IOrderRepository>();

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
              value: "100.00",
            },
          ],
        },
        {
          order_id: 456,
          total: "200.00",
          date: new Date("2024-10-01"),
          products: [
            {
              product_id: 2,
              value: "200.00",
            },
          ],
        },
      ],
    },
    {
      user_id: 2,
      name: "Francisquinha",
      orders: [
        {
          order_id: 789,
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
    },
  ];

  beforeEach(() => {
    mockOrderRepository.findAll.mockResolvedValue([]);
    mockOrderRepository.findByUserId.mockResolvedValue({
      name: "",
      orders: [],
      user_id: 123,
    });
    mockOrderRepository.findOrdersWithinDateRange.mockResolvedValue([]);

    orderService = new OrderService(mockOrderRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should filter orders by order ID", async () => {
    const filters: QueryStringRequestDTO = { order_id: "123" };

    mockOrderRepository.findOrderID.mockResolvedValue([mockOrders[0]]);

    const result = await orderService.execute(filters);

    expect(mockOrderRepository.findOrderID).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findOrdersWithinDateRange).toHaveBeenCalledTimes(
      0
    );
    expect(result).toEqual([
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
                value: "100.00",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("should find orders within date range", async () => {
    const filters: QueryStringRequestDTO = {
      init_date: "2023-01-01",
      last_date: "2024-12-31",
    };

    mockOrderRepository.findOrdersWithinDateRange.mockResolvedValue(mockOrders);

    const result = await orderService.execute(filters);

    expect(mockOrderRepository.findOrderID).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findOrdersWithinDateRange).toHaveBeenCalledTimes(
      1
    );
    expect(mockOrderRepository.findOrdersWithinDateRange).toHaveBeenCalledWith(
      new Date(filters.init_date!),
      new Date(filters.last_date!)
    );
    expect(result).toEqual(mockOrders);
  });

  test("should throw error if only one date is provided", async () => {
    const filters: QueryStringRequestDTO = { init_date: "2023-01-01" };

    await expect(orderService.execute(filters)).rejects.toThrow(
      "Para essa regra de negocio deve mandar o intervalo das datas"
    );
    expect(mockOrderRepository.findOrderID).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findOrdersWithinDateRange).toHaveBeenCalledTimes(
      0
    );
  });

  test("should return all orders if no filters are provided", async () => {
    const filters: QueryStringRequestDTO = {};

    mockOrderRepository.findAll.mockResolvedValue(mockOrders);

    const result = await orderService.execute(filters);

    expect(mockOrderRepository.findOrderID).toHaveBeenCalledTimes(0);
    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.findOrdersWithinDateRange).toHaveBeenCalledTimes(
      0
    );
    expect(result).toEqual(mockOrders);
  });
});
