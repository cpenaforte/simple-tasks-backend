import { Pool } from 'pg';
const pool: Pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.DB_PORT || '3000'),
});

export default pool;