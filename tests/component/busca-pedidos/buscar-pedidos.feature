#language: pt
Funcionalidade: Teste do endpoint buscar pedidos por filtro

Cenário: Busca de pedido por filtro de ordem
  Dado que existem registros de pedidos de usuário
  Quando solicito o pedido de id 123
  Então recebo os dados do pedido