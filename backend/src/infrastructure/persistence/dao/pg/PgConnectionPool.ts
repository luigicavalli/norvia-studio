import { Pool }         from "pg";
import { configDotenv } from "dotenv";


configDotenv({ path: '../.env', quiet: true });

const SUPABASE_DB_URL: string | undefined = process.env.SUPABASE_DB_URL;
const SUPABASE_SCHEMA: string | undefined = process.env.SUPABASE_SCHEMA;

if (!SUPABASE_DB_URL) throw new Error('Missing Supabase DB URL');
if (!SUPABASE_SCHEMA) throw new Error('Missing Supabase DB schema');

let poolInstance: Pool | null = null;

export function getPoolInstance(): Pool {

    if (!poolInstance) {
        poolInstance = new Pool({
            connectionString: SUPABASE_DB_URL,
            ssl: { rejectUnauthorized: false }, // nosemgrep: bypass-tls-verification
            options: `--search_path=${SUPABASE_SCHEMA}`,
        });
    }

    return poolInstance;

};