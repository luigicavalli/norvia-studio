/* eslint-disable @typescript-eslint/no-explicit-any */
import { configDotenv }                 from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";


configDotenv({ path: '../.env', quiet: true });

const SUPABASE_URL:      string | undefined = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SCHEMA:   string | undefined = process.env.SUPABASE_SCHEMA;

if (!SUPABASE_URL)      throw new Error('Missing Supabase URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing Supabase Anonymous Key');
if (!SUPABASE_SCHEMA)   throw new Error('Missing Supabase DB schema');

let supabase: SupabaseClient<any, string, any> | null = null;

export function getSupabaseClient(): SupabaseClient<any, string, any> {

    if (!supabase) {
        supabase = createClient<any, string, any>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
            db: {
                schema: SUPABASE_SCHEMA!
            }
        });
    }

    return supabase;

};