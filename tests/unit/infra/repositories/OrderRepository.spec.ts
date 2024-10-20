import { OrderRepository } from "../../../../src/infrastructure/repository/OrderRepository"; // Ajuste o caminho conforme necessário
import {
  OrderModel,
  UserOrderDocument,
} from "../../../../src/infrastructure/database/models/OrderModel";
import { UserOrder } from "../../../../src/domain/entities/OrderBuilder";
import { Types } from "mongoose";

jest.mock("../../../../src/infrastructure/database/models/OrderModel"); // Mocks the OrderModel

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;

  const mockUserOrderDocument = {
    user_id: 1,
    name: "John Doe",
    orders: [
      {
        _id: new Types.ObjectId("67158dc4af6336bd27d0e6f6"),
        order_id: 123,
        total: "100.00",
        date: new Date("2023-10-01"),
        products: [
          {
            _id: new Types.ObjectId("67158dc4af6336bd27d0e6f6"),
            product_id: 1,
            value: "100.00",
          },
        ],
      },
    ],
    _id: new Types.ObjectId("67158dc4af6336bd27d0e6f6"),
  } as unknown as UserOrderDocument;

  beforeEach(() => {
    orderRepository = new OrderRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should findByUserId and return UserOrder", async () => {
    const userId = 1;

    const mockUserOrderExpected: UserOrder = {
      user_id: userId,
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
    };
    (OrderModel.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockUserOrderDocument),
    });

    const result = await orderRepository.findByUserId(userId);

    expect(OrderModel.findOne).toHaveBeenCalledWith({ user_id: userId });
    expect(result).toEqual(mockUserOrderExpected);
  });

  test("should return null if no UserOrder is found", async () => {
    const userId = 2;

    (OrderModel.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await orderRepository.findByUserId(userId);

    expect(OrderModel.findOne).toHaveBeenCalledWith({ user_id: userId });
    expect(result).toBeNull();
  });

  test("should save a UserOrder", async () => {
    const userOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [],
    };

    (OrderModel.prototype.save as jest.Mock).mockResolvedValueOnce(userOrder);

    const result = await orderRepository.save(userOrder);

    expect(result).toEqual(userOrder);
  });

  test("should update a UserOrder", async () => {
    const userOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [],
    };

    (OrderModel.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(userOrder),
    });

    const result = await orderRepository.update(userOrder);

    expect(OrderModel.findOneAndUpdate).toHaveBeenCalledWith(
      { user_id: userOrder.user_id },
      userOrder,
      { new: true }
    );
    expect(result).toEqual(userOrder);
  });

  test("should return null if update fails", async () => {
    const userOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [],
    };

    (OrderModel.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await orderRepository.update(userOrder);

    expect(result).toBeNull();
  });

  test("should find all UserOrders", async () => {
    const mockOrders = [
      {
        user_id: 1,
        name: "John Doe",
        orders: [],
      },
    ];

    (OrderModel.find as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockOrders),
    });

    const result = await orderRepository.findAll();

    expect(OrderModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockOrders);
  });

  test("should find orders by order ID", async () => {
    const orderId = 1;

    const mockUserOrderExpected: UserOrder[] = [
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
    ];

    (OrderModel.find as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce([mockUserOrderDocument]),
    });

    const result = await orderRepository.findOrderID(orderId);

    expect(OrderModel.find).toHaveBeenCalledWith({
      "orders.order_id": orderId,
    });
    expect(result).toEqual(mockUserOrderExpected);
  });

  test("should find orders within date range", async () => {
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-12-31");

    const mockUserOrderExpected: UserOrder[] = [
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
    ];

    (OrderModel.aggregate as jest.Mock).mockResolvedValueOnce([
      mockUserOrderDocument,
    ]);

    const result = await orderRepository.findOrdersWithinDateRange(
      startDate,
      endDate
    );

    expect(OrderModel.aggregate).toHaveBeenCalledWith([
      { $unwind: "$orders" },
      { $match: { "orders.date": { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          name: { $first: "$name" },
          orders: { $push: "$orders" },
        },
      },
    ]);
    expect(result).toEqual(mockUserOrderExpected);
  });
});
