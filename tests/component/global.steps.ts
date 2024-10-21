import { AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import axios from "axios";
import { MongoClient } from "mongodb";
import { mongodbClient } from "../adapters/mongodb-connector";
import { clearCollections } from "../adapters/mongodb-operacoes";

BeforeAll({ timeout: 61000 }, async () => {
  const response = await axios.get<string>(
    `${process.env.API_BASE_URL}/health`,
    { timeout: 300 }
  );
  return response.data.startsWith("UP");
});

BeforeAll({ timeout: 61000 }, async () => {
  const client = await new MongoClient(
    process.env.MONGODB_CONNECTION_STRING || ""
  ).connect();
  const response = await client.db("tests").command({
    ping: 1,
  });
  try {
    return response.ok == 1;
  } finally {
    await client.close();
  }
});

BeforeAll(async () => {
  await mongodbClient.connect();
});

Before(async () => {
  await clearCollections();
});

AfterAll(async () => {
  await mongodbClient.close();
});
