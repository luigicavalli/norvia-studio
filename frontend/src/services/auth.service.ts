/**
 * -------
 * ANGULAR
 * -------
 */
import { Router }                     from '@angular/router';
import { inject, Injectable, signal } from '@angular/core';

/**
 * -----
 * CLERK
 * -----
 */
import { Clerk } from '@clerk/clerk-js';

/**
 * -----------
 * ENVIRONMENT
 * -----------
 */
import { environment } from '../environments/environment';


export type SignInResult = 'complete' | 'needs_second_factor';

export interface UserPreferences {
  language:     string;
  taskAssigned: boolean;
  deadlines:    boolean;
  comments:     boolean;
  weeklyDigest: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly router = inject(Router);
  private clerk!: Clerk;

  readonly isLoaded    = signal<boolean>(false);
  readonly isSignedIn  = signal<boolean>(false);
  readonly user        = signal<Clerk['user']>(null);

  // --- Init (chiamato in APP_INITIALIZER) ---

  async init(): Promise<void> {
    this.clerk = new Clerk(environment.clerkPublishableKey);
    await this.clerk.load();

    this.isLoaded.set(true);
    this.syncState();

    this.clerk.addListener(() => this.syncState());
  }

  private syncState(): void {
    this.isSignedIn.set(!!this.clerk.session);
    this.user.set(this.clerk.user);
  }

  // --- Auth ---

  async signIn(email: string, password: string): Promise<SignInResult> {
    const attempt = await this.clerk.client!.signIn.create({
      identifier: email,
      password,
    });

    if (attempt.status === 'complete') {
      await this.clerk.setActive({ session: attempt.createdSessionId });
      this.syncState();
      await this.router.navigate(['/home']);
      return 'complete';
    }

    if (attempt.status === 'needs_second_factor') {
      return 'needs_second_factor';
    }

    throw new Error(`Unexpected sign-in status: ${attempt.status}`);
  }

  async verifyMfa(code: string): Promise<void> {
    const signIn = this.clerk.client!.signIn;

    const strategies = (signIn.supportedSecondFactors ?? []) as { strategy: string }[];
    const strategy   =
      strategies.find(f => f.strategy === 'totp')?.strategy ??
      strategies.find(f => f.strategy === 'phone_code')?.strategy ??
      strategies.find(f => f.strategy === 'email_code')?.strategy ??
      'totp';

    const attempt = await signIn.attemptSecondFactor({
      strategy: strategy as 'totp' | 'phone_code' | 'email_code' | 'backup_code',
      code,
    });

    if (attempt.status === 'complete') {
      await this.clerk.setActive({ session: attempt.createdSessionId });
      this.syncState();
      await this.router.navigate(['/home']);
    }
  }

  async signUp(data: {
    firstName: string;
    lastName:  string;
    birthDate: Date | null;
    email:     string;
    password:  string;
  }): Promise<void> {
    const attempt = await this.clerk.client!.signUp.create({
      firstName:    data.firstName,
      lastName:     data.lastName,
      emailAddress: data.email,
      password:     data.password,
    });

    if (attempt.status === 'complete') {
      await this.clerk.setActive({ session: attempt.createdSessionId });
      this.syncState();
      await this.router.navigate(['/home']);
    }

    // Se Clerk richiede verifica email (status === 'missing_requirements')
    // si può gestire qui il flusso OTP
  }

  async updateProfile(firstName: string, lastName: string): Promise<void> {
    await this.clerk.user!.update({ firstName, lastName });
    this.syncState();
  }

  getPreferences(): UserPreferences {
    const meta = (this.clerk.user?.unsafeMetadata ?? {}) as Partial<UserPreferences>;
    return {
      language:      meta.language      ?? 'it',
      taskAssigned:  meta.taskAssigned  ?? true,
      deadlines:     meta.deadlines     ?? true,
      comments:      meta.comments      ?? false,
      weeklyDigest:  meta.weeklyDigest  ?? true,
    };
  }

  async savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const current = this.getPreferences();
    await this.clerk.user!.update({
      unsafeMetadata: { ...current, ...prefs },
    });
    this.syncState();
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.clerk.user!.updatePassword({ currentPassword, newPassword });
  }

  async signOut(): Promise<void> {
    await this.clerk.signOut();
    await this.router.navigate(['/']);
  }

  // --- Token per le chiamate API ---

  async getToken(): Promise<string | null> {
    return this.clerk.session?.getToken() ?? null;
  }

}
