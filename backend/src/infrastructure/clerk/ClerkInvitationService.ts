import { configDotenv }                        from 'dotenv';
import { createClerkClient, type ClerkClient } from '@clerk/express';


configDotenv({ path: '../.env', quiet: true });

export class ClerkInvitationService {

    private readonly clerk:            ClerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY as string });
    private readonly clerkRedirectUrl: string      = process.env.CLERK_INVITE_REDIRECT_URL as string;

    public async createInvitation(email: string): Promise<void> {
        await this.clerk.invitations.createInvitation({
            emailAddress: email,
            redirectUrl:  this.clerkRedirectUrl
        });
    };

    public async getUser(userId: string): Promise<{ email: string | null; firstName: string | null; lastName: string | null }> {
        const user = await this.clerk.users.getUser(userId);
        return {
            email:     user.emailAddresses?.[0]?.emailAddress ?? null,
            firstName: user.firstName ?? null,
            lastName:  user.lastName  ?? null,
        };
    };

};