import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Container, Inject } from "typescript-ioc";
import { OrderService } from "../services/order/OrderService";
import { IOrderService } from "../services/order/IOrderService.interface";

export interface QueryStringRequestDTO {
  order_id?: string;
  init_date?: string;
  last_date?: string;
}

export class OrderRoutes {
  private orderService: IOrderService;

  constructor() {
    // @Inject
    // private readonly orderService: IOrderService
    this.orderService = Container.get(OrderService);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get("/orders", this.execute.bind(this));
  }

  private async execute(
    request: FastifyRequest<{ Querystring: QueryStringRequestDTO }>,
    reply: FastifyReply
  ) {
    //try {
    const { init_date, last_date, order_id } = request.query;

    console.log("parei", init_date, last_date, order_id);

    const orders = await this.orderService.execute({
      order_id: order_id && this.validaOrderId(order_id),
      last_date: last_date && this.validarData(last_date),
      init_date: init_date && this.validarData(init_date),
    });

    console.log("orders", orders);

    reply.send(orders).status(200);
    // } catch (error) {
    //   console.log("err", error);
    // }
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
