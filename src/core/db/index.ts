import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = new URL(process.env.DATABASE_URL!);

const client = postgres({
  host: url.hostname,
  port: Number(url.port) || 5432,
  database: url.pathname.slice(1),
  username: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  prepare: false,
});

export const db = drizzle(client, { schema });
