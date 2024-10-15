import { FastifyInstance } from "fastify";
import { fileRoutes } from "./FileController";
import { FileService } from "../services/file/FileService";
import { Container } from "typescript-ioc";

// jest.mock("../services/FileService");

describe("FileController", () => {
  let server: FastifyInstance;
  let fileService: FileService;

  beforeAll(() => {
    server = {
      post: jest.fn(),
    } as unknown as FastifyInstance;
    fileService = Container.get(FileService);
  });

  xit("should register the /upload route", async () => {
    await fileRoutes(server);
    expect(server.post).toHaveBeenCalledWith("/upload", expect.any(Function));
  });

  // Adicione mais testes conforme necessário
});
