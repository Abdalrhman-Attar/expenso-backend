import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export default client;
