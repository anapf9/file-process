export const config = {
  mongoUrl:
    process.env.MONGO_URI ||
    "mongodb://admin:password123@localhost:27017/mydatabase?authSource=admin",
  port: Number(process.env.PORT) || 3001,  // Atualizando a porta para 3001
};