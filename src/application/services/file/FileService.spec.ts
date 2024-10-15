jest.mock("fs");
jest.mock("readline");

import { FileService, UserOrderDTO } from "./FileService";
import { Container } from "typescript-ioc";
import * as fs from "fs";
import readline from "readline";
import { mock } from "jest-mock-extended";
import { ProcessFileUseCase } from "../../../domain/usecases/ProcessFileUseCase";

jest.mock("fs");
jest.mock("readline");
jest.mock("../../../domain/usecases/ProcessFileUseCase");

describe("FileService", () => {
  let fileService: FileService;
  const processFileUseCaseMock = mock<ProcessFileUseCase>();

  beforeEach(() => {
    jest.resetAllMocks();
    // fileService = new FileService(processFileUseCaseMock);
  });

  xit("should process a file", async () => {
    const filePath = "path/to/file.txt";
    const mockReadStream = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          callback("mock line");
        } else if (event === "end") {
          callback();
        }
      }),
    };
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (readline.createInterface as jest.Mock).mockReturnValue(mockReadStream);

    //await fileService.processFile(filePath);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    //expect(processFileUseCase.execute).toHaveBeenCalled();
  });

  // Adicione mais testes conforme necessário
});
