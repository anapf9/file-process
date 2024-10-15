import { FastifyInstance, FastifyRequest } from "fastify";
import { Container } from "typescript-ioc";
import { OrderService } from "../services/OrderService";

const orderService: OrderService = Container.get(OrderService);

export interface QueryStringRequestDTO {
  order_id?: string;
  init_date?: string;
  last_date?: string;
}

export const orderRoutes = async (server: FastifyInstance): Promise<void> => {
  server.get(
    "/orders",
    async (
      request: FastifyRequest<{ Querystring: QueryStringRequestDTO }>,
      reply
    ) => {
      const { init_date, last_date, order_id } = request.query;

      console.log("query", init_date, last_date, order_id);

      const orders = await orderService.getOrders({ order_id });
      reply.send(orders);
    }
  );
};
