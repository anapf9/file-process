import fastify, { FastifyInstance } from "fastify";
import fs from "fs";
import FormData from "form-data"; // Importa a biblioteca form-data
import { FileRoutes } from "../../../../src/application/controllers/FileController";
import { FileService } from "../../../../src/application/services/file/FileService";

jest.mock("fs");
jest.mock("../../../../src/application/services/file/FileService");

describe("FileRoutes", () => {
  let serverInstance: FastifyInstance;
  let fileService: jest.Mocked<FileService>;

  beforeAll(async () => {
    serverInstance = fastify();
    serverInstance.register(require("@fastify/multipart"));
    const fileRoutes = new FileRoutes();
    await fileRoutes.registerRoutes(serverInstance);
    fileService = new FileService() as jest.Mocked<FileService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  xit("should upload and process a valid TXT file", async () => {
    const mockFileData = {
      filename: "test.txt",
      mimetype: "text/plain",
      file: {
        pipe: jest.fn(),
      },
    };

    // Definindo o tipo para o mockWriteStream
    const mockWriteStream: {
      on: (event: string, callback: () => void) => typeof mockWriteStream;
      write: jest.Mock;
      end: jest.Mock;
    } = {
      on: jest.fn((event, callback) => {
        if (event === "finish") {
          callback(); // Simula a finalização do stream
        }
        return mockWriteStream;
      }),
      write: jest.fn(),
      end: jest.fn(),
    };

    // Mocka a função createWriteStream
    (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);

    // Mocka o método execute do FileService
    fileService.execute = jest.fn().mockResolvedValue(undefined);

    // Usando form-data para criar o payload corretamente
    const form = new FormData();
    form.append(
      "file",
      Buffer.from(
        "0000000088                             Terra Daniel DDS00000008360000000001     1756.2220210909"
      ),
      {
        filename: "test.txt",
        contentType: "text/plain",
      }
    );

    // Simula a requisição
    const response = await serverInstance.inject({
      method: "POST",
      url: "/upload",
      headers: form.getHeaders(), // Adiciona os headers do form-data
      payload: form,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Arquivo enviado e processado com sucesso!",
    });

    expect(fs.createWriteStream).toHaveBeenCalledWith(
      expect.stringContaining("uploads/test.txt")
    );
    expect(mockFileData.file.pipe).toHaveBeenCalledWith(mockWriteStream);
    expect(fileService.execute).toHaveBeenCalledWith(
      expect.stringContaining("uploads/test.txt")
    );
  });

  test("should return 400 if the file type is invalid", async () => {
    const form = new FormData();
    form.append("file", Buffer.from("test content"), {
      filename: "test.png",
      contentType: "image/png",
    });

    const response = await serverInstance.inject({
      method: "POST",
      url: "/upload",
      headers: form.getHeaders(),
      payload: form,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Tipo de arquivo inválido. Apenas arquivos TXT são permitidos.",
    });
  });

  test("should return 500 if an error occurs during processing", async () => {
    const mockWriteStream: {
      on: (event: string, callback: () => void) => typeof mockWriteStream;
      write: jest.Mock;
      end: jest.Mock;
    } = {
      on: jest.fn((event, callback) => {
        if (event === "finish") {
          callback(); // Simula a finalização do stream
        }
        return mockWriteStream;
      }),
      write: jest.fn(),
      end: jest.fn(),
    };

    (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);
    fileService.execute = jest
      .fn()
      .mockRejectedValue(new Error("Processing error"));

    const form = new FormData();
    form.append("file", Buffer.from("test content"), {
      filename: "test.txt",
      contentType: "text/plain",
    });

    const response = await serverInstance.inject({
      method: "POST",
      url: "/upload",
      headers: form.getHeaders(),
      payload: form,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: "Erro ao processar o arquivo" });
  });
});
