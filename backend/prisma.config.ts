/**
 * ------
 * PRISMA
 * ------
 */
import { defineConfig, env } from 'prisma/config';

/**
 * ------
 * DOTENV
 * ------
 */
import 'dotenv/config';
import { configDotenv } from 'dotenv';

configDotenv({ path: '../.env' });

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: env('DATABASE_URL'),
    },
});