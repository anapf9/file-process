import fastify, { FastifyInstance } from "fastify";
import supertest, { SuperTest, Test } from "supertest";
import { OrderRoutes } from "../../src/application/controllers/OrderController";
import { IOrderService } from "../../src/application/services/order/IOrderService.interface";
import { mock } from "jest-mock-extended";
import { Container } from "typescript-ioc";
import { OrderRepository } from "../../src/infrastructure/repository/OrderRepository";
import { OrderService } from "../../src/application/services/order/OrderService";

describe("OrderRoutes", () => {
  let serverInstance: FastifyInstance;
  let request: SuperTest<Test>;
  const orderServiceMock = mock<IOrderService>();
  const orderRepositoryMock = mock<OrderRepository>();

  const orders = [{ user_id: 1, name: "Josefina", orders: [] }];

  beforeAll(async () => {
    // Bind the OrderService to the IOrderService interface
    Container.bind(IOrderService).to(OrderService);

    serverInstance = fastify();

    const orderRoutes = new OrderRoutes();

    await orderRoutes.registerRoutes(serverInstance);

    request = supertest(serverInstance.server) as unknown as SuperTest<Test>;

    await serverInstance.ready();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock the orderService.execute method

    orderServiceMock.execute.mockResolvedValue(orders);
  });

  afterAll(async () => {
    await serverInstance.close();
  });

  it("should call orderService.execute with correct parameters", async () => {
    const response = await request.get("/orders?order_id=123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(orders);
    expect(orderServiceMock.execute).toHaveBeenCalledWith({
      order_id: "123",
      init_date: undefined,
      last_date: undefined,
    });
  });
});
