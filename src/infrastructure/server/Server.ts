import fastify from "fastify";
import { config } from "../config/config";
import { FileRoutes } from "../../application/controllers/FileController";
import { OrderRoutes } from "../../application/controllers/OrderController";
import multipart from "@fastify/multipart";

const server = fastify({ logger: true });

server.register(multipart);

const fileRoutes = new FileRoutes();
const orderRoutes = new OrderRoutes();

fileRoutes.registerRoutes(server);
orderRoutes.registerRoutes(server);

server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

export const startServer = async () => {
  try {
    server.listen({ port: config.port, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
    console.info(`Server running at http://localhost:${config.port}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};