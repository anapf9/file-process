import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Container } from "typescript-ioc";
import { OrderService } from "../services/OrderService";

export interface QueryStringRequestDTO {
  order_id?: string;
  init_date?: string;
  last_date?: string;
}

export class OrderRoutes {
  private readonly orderService: OrderService;

  constructor() {
    this.orderService = Container.get(OrderService);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get("/orders", this.getOrders.bind(this));
  }

  private async getOrders(
    request: FastifyRequest<{ Querystring: QueryStringRequestDTO }>,
    reply: FastifyReply
  ) {
    const { init_date, last_date, order_id } = request.query;

    const orders = await this.orderService.getOrders({
      order_id: order_id && this.validaOrderId(order_id),
      last_date: last_date && this.validarData(last_date),
      init_date: init_date && this.validarData(init_date),
    });
    reply.send(orders);
  }

  private validarData(data: string): string {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const dataValida = data && regex.test(data);

    console.log("dataValida", dataValida);

    if (!dataValida)
      throw new Error("A data precisa seguir os padroes ISO 8601 (YYYY-MM-DD)");

    return data;
  }

  private validaOrderId(input: string): string {
    const regex = /^\d+$/;
    const orderValida = regex.test(input);

    if (!orderValida)
      throw new Error("O id do pedido deve conter apenas números");

    return input;
  }
}
