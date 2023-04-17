import { Pool } from "npm:node-postgres";
import "https://deno.land/x/dotenv/load.ts";


const options = {
  user: Deno.env.get('PG_USER'),
  host: Deno.env.get('HOSTNAME'),
  database: Deno.env.get('DB'),
  password: Deno.env.get('PG_PASSWORD'),
  port: parseInt(Deno.env.get('DB_PORT') || '3000'),
  max: 20,
  connectionTimeoutMillis: 60 * 1000
}

console.log(options);

const pool: Pool = new Pool(options);

export default pool;