import { errorHandler }    from './http/errorHandler.js';
import { configDotenv }    from 'dotenv';
import { createApiRouter } from './http/routes.js';

import express, { type NextFunction, type Request, type Response } from 'express';


configDotenv({ path: '../.env', quiet: true });

const port: number | undefined = Number(process.env.EXPRESS_PORT);

if (!port) throw new Error('Missing Express port');

const app = express();

const jsonParser = express.json();

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body !== undefined) {
        return next();
    }

    return jsonParser(req, res, next);
});

app.use('/api', createApiRouter());
app.use(errorHandler);

app.listen(port, (error: Error | undefined): void => {
    if (error) {
        console.error(error);

        return;
    }
    
    console.log(`Server running at http://localhost:${port}`);
});