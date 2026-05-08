import './http/sentry.js';

import * as Sentry                  from '@sentry/node';
import cors                         from 'cors';
import { errorHandler }             from './http/errorHandler.js';
import { configDotenv }             from 'dotenv';
import { createApiRouter }          from './http/routes.js';
import { createWebhookRouter }      from './http/webhookRoutes.js';
import { clerkMiddleware, getAuth } from '@clerk/express';

import express, { type NextFunction, type Request, type Response } from 'express';


configDotenv({ path: '../.env', quiet: true });

const port = Number(process.env.PORT ?? process.env.EXPRESS_PORT);

if (!port) throw new Error('Missing Express port');

const app = express();

app.use(cors({
    origin:      process.env.CORS_ORIGIN ?? 'http://localhost:4200',
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(clerkMiddleware());

const jsonParser = express.json();

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body !== undefined) {
        return next();
    }

    return jsonParser(req, res, next);
});

app.use('/health', (_req: Request, res: Response) => res.send(`${new Date().toISOString()} - Health ok`));

const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }
    next();
};

app.use('/webhooks', createWebhookRouter());
app.use('/api', authGuard, createApiRouter());

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

app.listen(port, (error: Error | undefined): void => {
    if (error) {
        console.error(error);

        return;
    }
    
    console.log(`Server running at http://localhost:${port}`);
});