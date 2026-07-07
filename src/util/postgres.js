import { Pool } from "pg";

console.log("POSTGRES_HOST =", process.env.POSTGRES_HOST);

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: Number(process.env.POSTGRES_PORT),
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL conectado");
});

pool.on("error", (err) => {
  console.error("❌ Error del pool:", err);
});