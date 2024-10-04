export const config = {
  mongoUrl:
    "mongodb://admin:password123@localhost:27017/mydatabase?authSource=admin",
  port: process.env.PORT ?? 3000,
};
