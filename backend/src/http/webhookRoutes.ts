import { Webhook }                   from 'svix';
import { wiring }                    from './wiring.js';

import { Router, type Request, type Response, type NextFunction } from 'express';


export const createWebhookRouter = (deps = wiring) => {

    const { activateTeamMemberUC } = deps;

    const router = Router();

    router.post('/clerk', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const secret = process.env.CLERK_WEBHOOK_SECRET;
            if (!secret) throw new Error('Missing CLERK_WEBHOOK_SECRET');

            const wh = new Webhook(secret);

            const payload = wh.verify(
                JSON.stringify(req.body),
                {
                    'svix-id':        req.headers['svix-id']        as string,
                    'svix-timestamp': req.headers['svix-timestamp'] as string,
                    'svix-signature': req.headers['svix-signature'] as string,
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { type: string; data: Record<string, any> };

            if (payload.type === 'user.created') {
                const userId       = payload.data['id']                                       as string;
                const emailAddress = payload.data['email_addresses']?.[0]?.['email_address'] as string | undefined;
                const firstName    = (payload.data['first_name'] as string | null) ?? null;
                const lastName     = (payload.data['last_name']  as string | null) ?? null;

                if (userId && emailAddress) {
                    await activateTeamMemberUC.execute({ email: emailAddress, userId, firstName, lastName });
                }
            }

            res.status(200).json({ received: true });
        } catch (error) {
            next(error);
        }
    });

    return router;

};
