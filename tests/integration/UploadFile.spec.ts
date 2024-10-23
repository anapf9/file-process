import fastify, { FastifyInstance } from "fastify";
import supertest, { SuperTest, Test } from "supertest";
import { OrderRoutes } from "../../src/application/controllers/OrderController";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserOrder } from "../../src/infrastructure/database/models/OrderModel";
import { connect, connection, Collection } from "mongoose";
import { FileRoutes } from "../../src/application/controllers/FileController";
import multipart from "@fastify/multipart";
import { Container } from "typescript-ioc";
import ioc from "../../src/infrastructure/config/ioc";

describe("Testes de integração", () => {
  let serverInstance: FastifyInstance;
  let request: SuperTest<Test>;
  let server: MongoMemoryServer;
  let collection: Collection<UserOrder>;

  beforeAll(async () => {
    // Configuração do banco de dados
    server = await MongoMemoryServer.create();
    const uri = server.getUri("dbTest");
    await connect(uri);

    collection = connection.collection("userOrders");

    // Configuração do servidor
    serverInstance = fastify();
    serverInstance.register(multipart);

    const orderRoutes = new OrderRoutes();
    const fileRoutes = new FileRoutes();

    Container.configure(...ioc);

    await fileRoutes.registerRoutes(serverInstance);
    await orderRoutes.registerRoutes(serverInstance);

    request = supertest(serverInstance.server) as unknown as SuperTest<Test>;

    await serverInstance.ready();
  });

  afterAll(async () => {
    await server.stop();
    await connection.destroy();
    await serverInstance.close();
  });

  it("1 - Deve fazer o envio do arquivo na rota POST com sucesso", async () => {
    const response = await request
      .post("/upload")
      .attach("file", "tests/integration/file/teste.txt");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Arquivo enviado e processado com sucesso!"
    );
  });

  it("Deve solicitar o pedido de id 836", async () => {
    const response = await request.get("/orders").query({ order_id: "836" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        user_id: 88,
        name: "Terra Daniel DDS",
        orders: [
          {
            order_id: 836,
            total: "3655.24",
            date: "2021-09-09T00:00:00.000Z",
            products: [
              { product_id: 1, value: "1756.22" },
              { product_id: 3, value: "1899.02" },
            ],
          },
        ],
      },
    ]);
  });

  it("Deve retornar os pedidos de filtro por datas", async () => {
    const response = await request
      .get("/orders")
      .query({ last_date: "2021-07-24", init_date: "2021-07-23" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        user_id: 88,
        name: "Terra Daniel DDS",
        orders: [
          {
            order_id: 835,
            total: "2687.26",
            date: "2021-07-23T00:00:00.000Z",
            products: [
              { product_id: 2, value: "987.82" },
              { product_id: 0, value: "1699.44" },
            ],
          },
        ],
      },
    ]);
  });

  it("Deve retornar todos os pedidos", async () => {
    const response = await request.get("/orders");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        user_id: 88,
        name: "Terra Daniel DDS",
        orders: [
          {
            order_id: 836,
            total: "3655.24",
            date: "2021-09-09T00:00:00.000Z",
            products: [
              {
                product_id: 1,
                value: "1756.22",
              },
              {
                product_id: 3,
                value: "1899.02",
              },
            ],
          },
          {
            order_id: 835,
            total: "2687.26",
            date: "2021-07-23T00:00:00.000Z",
            products: [
              {
                product_id: 2,
                value: "987.82",
              },
              {
                product_id: 0,
                value: "1699.44",
              },
            ],
          },
        ],
      },
    ]);
  });
});
