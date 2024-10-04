import { startServer } from "./infrastructure/server/Server";
import { connectDB } from "./infrastructure/database/MongoDB";
import "./infrastructure/config/ioc";

const startApp = async () => {
  await connectDB();
  await startServer();
};

startApp().catch((err) => {
  console.error({
    message: "aplicação encerrada com problemas",
    errorMessage: err.message,
    errorStack: err.stack,
  });
  process.exit(1);
});
