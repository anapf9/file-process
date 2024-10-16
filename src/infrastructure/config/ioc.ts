import { Container } from "typescript-ioc";
import { OrderRepository } from "../repository/OrderRepository";
import { ProcessFileUseCase } from "../../domain/usecases/ProcessFileUseCase";
import { GetOrdersUseCase } from "../../domain/usecases/GetOrdersUseCase";
import { FileService } from "../../application/services/file/FileService";
import { OrderService } from "../../application/services/order/OrderService";
import { IProcessFileUseCase } from "../../domain/interfaces/usecases/IProcessFileUsecase";
import { IOrderRepository } from "../../domain/interfaces/DBOperationsPort";
import { IOrderService } from "../../application/services/order/IOrderService.interface";

Container.bind(IOrderRepository).to(OrderRepository);
Container.bind(IProcessFileUseCase).to(ProcessFileUseCase);
Container.bind(GetOrdersUseCase).to(GetOrdersUseCase);
Container.bind(FileService).to(FileService);
Container.bind(IOrderService).to(OrderService);

export default [{ bind: IOrderService, to: OrderService }];
