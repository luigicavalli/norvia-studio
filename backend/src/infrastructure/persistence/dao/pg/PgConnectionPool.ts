import { Pool }         from "pg";
import { configDotenv } from "dotenv";


configDotenv({ path: '../.env', quiet: true });

const POSTGRES_USER:       string | undefined = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD:   string | undefined = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB_NAME:    string | undefined = process.env.POSTGRES_DB_NAME;
const POSTGRES_PORT:       number | undefined = Number(process.env.POSTGRES_PORT);

if (!POSTGRES_USER)     throw new Error('Missing Postgres username');
if (!POSTGRES_PASSWORD) throw new Error('Missing Postgres password');
if (!POSTGRES_DB_NAME)  throw new Error('Missing Postgres database name');
if (!POSTGRES_PORT)     throw new Error('Missing Postgres port');

/**
 * Postgres connection pool configuration
 */
const poolConfig = {
    user:     POSTGRES_USER,
    database: POSTGRES_DB_NAME,
    password: POSTGRES_PASSWORD,
    port:     POSTGRES_PORT
};

/**
 * Postgres connection pool singleton
 */
let poolInstance: Pool | null = null;

/**
 * Get the Postgres connection pool instance
 * @returns the PG Pool instance
 */
export function getPoolInstance(): Pool {

    if (!poolInstance) {
        poolInstance = new Pool(poolConfig);
    }

    return poolInstance;

};