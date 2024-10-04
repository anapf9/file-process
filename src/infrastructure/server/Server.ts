import fastify from "fastify";
import { config } from "../config/config";
import { fileRoutes } from "../../application/controllers/FileController";
import { orderRoutes } from "../../application/controllers/OrderController";
import multipart from "@fastify/multipart";

const server = fastify({ logger: true });

server.register(multipart);
server.register(fileRoutes);
server.register(orderRoutes);

//https://dev.to/lokosama/node-js-upload-binary-image-on-the-fly-with-fastify-and-cloudinary-5c1h
//https://www.npmjs.com/package/fastify-multer
//https://github.com/Shulammite-Aso/fastify-file-upload

export const startServer = async () => {
  try {
    server.listen({ port: 3000 }, (err, address) => {
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
