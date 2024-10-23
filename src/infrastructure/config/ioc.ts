import { Container } from "typescript-ioc";
import { OrderRepository } from "../repository/OrderRepository";
import { ProcessFileUseCase } from "../../domain/usecases/ProcessFileUseCase";
import { GetOrdersUseCase } from "../../domain/usecases/GetOrdersUseCase";
import { FileService } from "../../application/services/file/FileService";
import { IProcessFileUseCase } from "../../domain/interfaces/usecases/IProcessFileUsecase";
import { IOrderRepository } from "../../domain/interfaces/DBOperationsPort";
import { IGetOrdersUseCase } from "../../domain/interfaces/usecases/IGetOrdersUsecase";
import { IFileService } from "../../application/services/file/IFileService.interface";

Container.bind(IOrderRepository).to(OrderRepository);
Container.bind(IProcessFileUseCase).to(ProcessFileUseCase);
Container.bind(IGetOrdersUseCase).to(GetOrdersUseCase);
Container.bind(IFileService).to(FileService);

export default [
  { bind: IOrderRepository, to: OrderRepository },
  { bind: IProcessFileUseCase, to: ProcessFileUseCase },
  { bind: IGetOrdersUseCase, to: GetOrdersUseCase },
  { bind: IFileService, to: FileService },
];
