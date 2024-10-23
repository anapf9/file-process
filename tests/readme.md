# Planejamento de tests

## Testes unitários e Integração

----------------------------------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------------------|---------|----------|---------|---------|-------------------
All files | 96.03 | 88.23 | 96.82 | 95.83 |  
 application/controllers | 95.74 | 91.66 | 100 | 95.74 |  
 FileController.ts | 92.3 | 50 | 100 | 92.3 | 25-26  
 OrderController.ts | 100 | 100 | 100 | 100 |  
 application/services/file | 100 | 66.66 | 100 | 100 |  
 FileService.ts | 100 | 66.66 | 100 | 100 | 88-90  
 IFileService.interface.ts | 100 | 100 | 100 | 100 |  
 domain/entities | 87.87 | 100 | 88.88 | 87.87 |  
 OrderBuilder.ts | 87.87 | 100 | 88.88 | 87.87 | 96-102  
 domain/interfaces | 100 | 100 | 100 | 100 |  
 DBOperationsPort.ts | 100 | 100 | 100 | 100 |  
 domain/interfaces/usecases | 100 | 100 | 100 | 100 |  
 IGetOrdersUsecase.ts | 100 | 100 | 100 | 100 |  
 IProcessFileUsecase.ts | 100 | 100 | 100 | 100 |  
 domain/mapper | 100 | 100 | 100 | 100 |  
 MapperUserOrderApplicationToDomain.ts | 100 | 100 | 100 | 100 |  
 domain/usecases | 98.43 | 92.85 | 100 | 98.27 |  
 GetOrdersUseCase.ts | 100 | 100 | 100 | 100 |  
 ProcessFileUseCase.ts | 97.87 | 85.71 | 100 | 97.72 | 107  
 infrastructure/config | 100 | 100 | 100 | 100 |  
 ioc.ts | 100 | 100 | 100 | 100 |  
 infrastructure/database/models | 100 | 100 | 100 | 100 |  
 OrderModel.ts | 100 | 100 | 100 | 100 |  
 infrastructure/repository | 91.66 | 100 | 100 | 90.9 |  
 OrderRepository.ts | 91.66 | 100 | 100 | 90.9 | 63-64  
----------------------------------------|---------|----------|---------|---------|-------------------

## Teste de Componente (GET)

Dado que existem registros de pedidos de usuário
Quando solicito o pedido de id 123
Então recebo os dados do pedido

TODO: finalizar o setup e execução do teste de componente
