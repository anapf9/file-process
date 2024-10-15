# Planejamento de tests

## Testes unitários

1 - APP - controller - OrderRoutes
2 - DOMAIN - usecase - ProcessFileUseCase
3 - INFRA - repository - findOrdersWithinDateRange

## Teste de integração (POST)

ASSERT - Dado que não existem registros, deve salvar corretamente o registro ao enviar um documento
ASSERT - Dado que existe um registro para o usuario de id 85, deve atualizar corretamente os dados da compra e produto

## Teste de Componente (GET)

Dado que existem registros de pedidos de usuário
Quando solicito o pedido de id 123
Então recebo os dados do pedido
