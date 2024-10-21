import fastify, { FastifyInstance } from "fastify";
import supertest, { SuperTest, Test } from "supertest";
import { OrderRoutes } from "../../src/application/controllers/OrderController";

import { Collection, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  UserOrder,
  UserOrderDocument,
  UserOrderSchema,
} from "../../src/infrastructure/database/models/OrderModel";
import { connect, disconnect, model, Model } from "mongoose";
import { FileRoutes } from "../../src/application/controllers/FileController";
import multipart from "@fastify/multipart";

describe("Testes de integração", () => {
  let serverInstance: FastifyInstance;
  let request: SuperTest<Test>;
  let server: MongoMemoryServer;
  let client: MongoClient;
  let collection: Collection<UserOrder>;
  let UserOrderModel: Model<UserOrderDocument>;

  beforeAll(async () => {
    // Configuração do banco de dados
    server = await MongoMemoryServer.create();
    client = new MongoClient(server.getUri());
    await client.connect();
    await connect(server.getUri(), { dbName: "dbTest" });
    collection = await client.db("dbTest").createCollection("userOrders");
    UserOrderModel = model<UserOrderDocument>(
      "UserOrderModel",
      UserOrderSchema
    );

    // Configuração do servidor
    serverInstance = fastify();
    serverInstance.register(multipart); // Registra o plugin multipart

    const orderRoutes = new OrderRoutes();
    const fileRoutes = new FileRoutes();

    await fileRoutes.registerRoutes(serverInstance);
    await orderRoutes.registerRoutes(serverInstance);

    request = supertest(serverInstance.server) as unknown as SuperTest<Test>;

    await serverInstance.ready();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await collection.deleteMany({});
  });

  afterAll(async () => {
    await disconnect();
    await client.close();
    await serverInstance.close();
  });

  it("should call orderService.execute with correct parameters", async () => {
    const response = await request
      .post("/upload")
      .attach("file", "tests/integration/file/teste.txt");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Arquivo enviado e processado com sucesso!"
    );
  });
});
