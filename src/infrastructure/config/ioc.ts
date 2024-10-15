import { Container } from "typescript-ioc";
import { OrderRepository } from "../repository/OrderRepository";
import { ProcessFileUseCase } from "../../domain/usecases/ProcessFileUseCase";
import { GetOrdersUseCase } from "../../domain/usecases/GetOrdersUseCase";
import { FileService } from "../../application/services/file/FileService";
import { OrderService } from "../../application/services/OrderService";
import { IProcessFileUseCase } from "../../domain/interfaces/usecases/IProcessFileUsecase";
import { IOrderOperations } from "../../domain/interfaces/DBOperationsPort";

Container.bind(IOrderOperations).to(OrderRepository);
Container.bind(IProcessFileUseCase).to(ProcessFileUseCase);
Container.bind(GetOrdersUseCase).to(GetOrdersUseCase);
Container.bind(FileService).to(FileService);
Container.bind(OrderService).to(OrderService);
