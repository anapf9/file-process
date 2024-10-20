import fastify, { FastifyInstance } from "fastify";

import { Container } from "typescript-ioc";
import { UserOrder } from "../../../../src/domain/entities/OrderBuilder";
import { OrderRoutes } from "../../../../src/application/controllers/OrderController";
import { IGetOrdersUseCase } from "../../../../src/domain/interfaces/usecases/IGetOrdersUsecase";
import { GetOrdersUseCase } from "../../../../src/domain/usecases/GetOrdersUseCase";

describe("OrderRoutes", () => {
  let serverInstance: FastifyInstance;
  let orderUsecaseMock: IGetOrdersUseCase;

  const orders: UserOrder[] = [
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

  const orderAppExpect = [
    {
      user_id: 1,
      name: "John Doe",
      orders: [
        {
          order_id: 123,
          total: "100.00",
          date: new Date("2023-10-01").toISOString(),
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

  beforeEach(async () => {
    orderUsecaseMock = {
      execute: jest.fn().mockResolvedValue(orders),
    };

    Container.bind(GetOrdersUseCase).factory(() => orderUsecaseMock);

    serverInstance = fastify();

    const orderRoutes = new OrderRoutes();
    await orderRoutes.registerRoutes(serverInstance);

    await serverInstance.ready();
  });

  afterEach(async () => {
    await serverInstance.close();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should call orderService.execute with correct parameters", async () => {
    const response = await serverInstance.inject({
      method: "GET",
      url: "/orders?order_id=123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify(orderAppExpect));
    expect(orderUsecaseMock.execute).toHaveBeenCalledWith({
      order_id: "123",
      init_date: undefined,
      last_date: undefined,
    });
  });

  it("should validate order_id correctly", async () => {
    const response = await serverInstance.inject({
      method: "GET",
      url: "/orders?order_id=123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify(orderAppExpect));
  });

  it("should throw an error for invalid order_id", async () => {
    serverInstance.inject(
      {
        method: "GET",
        url: "/orders?order_id=abc",
      },
      (_error, response) => {
        expect(response?.json()).toEqual({
          statusCode: 500,
          error: "Internal Server Error",
          message: "O id do pedido deve conter apenas números",
        });
      }
    );
  });

  it("should validate init_date and last_date correctly", async () => {
    const response = await serverInstance.inject({
      method: "GET",
      url: "/orders?init_date=2023-10-01&last_date=2023-10-31",
    });

    expect(response.statusCode).toBe(200);
    expect(orderUsecaseMock.execute).toHaveBeenCalledWith({
      order_id: undefined,
      init_date: "2023-10-01",
      last_date: "2023-10-31",
    });
  });

  it("should throw an error for invalid init_date", async () => {
    serverInstance.inject(
      {
        method: "GET",
        url: "/orders?init_date=janeiro",
      },
      (_error, response) => {
        expect(response?.json()).toEqual({
          statusCode: 500,
          error: "Internal Server Error",
          message: "A data precisa seguir os padroes ISO 8601 (YYYY-MM-DD)",
        });
      }
    );
  });
});
