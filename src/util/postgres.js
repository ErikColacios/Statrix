import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  //connectionString: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false
      },
    },
});