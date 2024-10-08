## Introdução

Este projeto é um exemplo de aplicação de processamento de arquivos com um formato legado de um arquivo txt, sendo processado para criar/atualizar cada registro no banco de acordo com a quantidade de pedidos e produtos de cada compra do usuário. Haveá tambem a consulta desses registros de acordo com 2 tipos de filtros.
Ele foi desenvolvido utilizando Node.js, TypeScript, Fastify e MongoDB.

## Subindo o Projeto com Docker

Para subir o projeto utilizando Docker, siga os passos abaixo:

1. **Construa e inicie os containers:**

   ```bash
   docker-compose up -d
   ```

PS: apesar de ter um container em node, o mesmo não será usado por falta de configurações necessárias para o container ser acessivel.
Dessa forma subiremos apenas o container do docker, com o comando acima.

2. **Acesse a aplicação:**

Para executar a aplicação, utilize o comando:

```bash
npm i && npm run start
```

A aplicação estará disponível em `http://localhost:3001`.

## Arquitetura e Principios

### Motivação

- **DDD**: A separação entre as camadas de domínio, aplicação e infraestrutura facilita a manutenção e evolução do código, além de promover um design orientado ao domínio.
- **Arquitetura Hexagonal**: Permite que a aplicação seja independente de frameworks e tecnologias externas, facilitando a testabilidade e a troca de componentes.

A organização das pastas:

- **src/application**: Contém os controladores, serviços e mapeadores que lidam com a lógica de aplicação.
- **src/domain**: Contém as entidades, interfaces e casos de uso que representam o domínio da aplicação.
- **src/infrastructure**: Contém a configuração, banco de dados, repositórios e servidor.
- **src/main.ts**: Ponto de entrada da aplicação.

### SOLID

- **Single Responsibility Principle (SRP)**: Cada classe tem uma única responsabilidade. Por exemplo, `FileService` é responsável por processar arquivos, enquanto `OrderService` lida com operações relacionadas a pedidos.
- **Open/Closed Principle (OCP)**: As classes estão abertas para extensão, mas fechadas para modificação. Novas funcionalidades podem ser adicionadas sem alterar o código existente.
- **Interface Segregation Principle (ISP)**: As interfaces são específicas e focadas. Por exemplo, `IProcessFileUseCase` define apenas o método necessário para processar arquivos.
- **Dependency Inversion Principle (DIP)**: As dependências são injetadas, permitindo que as classes dependam de abstrações em vez de implementações concretas.

## Falta de Testes Unitários

Atualmente, o projeto não possui testes unitários implementados. No entanto, é será feito posteriormente para manter a qualidade e a confiabilidade do código.

## Realizando Requisições com Postman

### Upload de Arquivo

1. **Endpoint**: `POST /upload`
2. **Descrição**: Faz o upload de um arquivo TXT e processa seu conteúdo.
3. **Parâmetros**:
   - Arquivo: `file` (tipo: `text/plain`)

**Exemplo de Requisição no Postman**:

- Selecione o método `POST`.
- URL: `http://localhost:3001/upload`
- Vá para a aba `Body`.
- Selecione `form-data`.
- Adicione um campo com o nome `file` e selecione o arquivo TXT para upload.

**Resposta Esperada**:

```json
{
  "message": "Arquivo enviado e processado com sucesso!"
}
```

### Consulta de Pedidos

1. **Endpoint**: `GET /orders`
2. **Descrição**: Consulta pedidos com base em filtros opcionais.
3. **Parâmetros**:
   - `order_id` (opcional)
   - `init_date` (opcional)
   - `last_date` (opcional)

**Exemplo de Requisição no Postman**:

- Selecione o método `GET`.
- URL: `http://localhost:3001/orders?order_id=123`

**Resposta Esperada**:

```json
[
  {
    "user_id": 1,
    "name": "John Doe",
    "orders": [
      {
        "order_id": 123,
        "total": "100.00",
        "date": "2023-10-01T00:00:00.000Z",
        "products": [
          {
            "product_id": 1,
            "value": "50.00"
          },
          {
            "product_id": 2,
            "value": "50.00"
          }
        ]
      }
    ]
  }
]
```

## TODO:

- Usar a biblioteca "class-validator" para validação dos query params do GET.
- Fazer os testes unitários com a biblioteca jest
- Usar o serveless framework para melhorar o fluxo de processamento do arquivo com uma lambda para processar cada linha do csv e enviar para um SQS com DLQ, e outra lambda para fazer a logica se consulta/criação/atualização no banco para garantir que todas as informações sejam processadas corretamente sem que a solicitação do documento seja sincrona.
- Usar o desing pattern "strategy" para as possibilides de filtros.

## Conclusão

Este projeto demonstra como aplicar os princípios de DDD e Arquitetura Hexagonal em uma aplicação Node.js. A organização das pastas e a separação de responsabilidades facilitam a manutenção, evolução e testabilidade do código.

```

```
