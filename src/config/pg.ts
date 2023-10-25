import { Pool } from 'pg';

const pool: Pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.HOSTNAME,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;