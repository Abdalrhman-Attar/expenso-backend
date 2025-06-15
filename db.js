// db/client.js  (or wherever your pg client is defined)
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default client;
