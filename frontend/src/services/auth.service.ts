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
    this.isSignedIn.set(!!this.clerk.user);
    this.user.set(this.clerk.user);
  }

  // --- Auth ---

  async signIn(email: string, password: string): Promise<void> {
    const attempt = await this.clerk.client!.signIn.create({
      identifier: email,
      password,
    });

    if (attempt.status === 'complete') {
      await this.clerk.setActive({ session: attempt.createdSessionId });
      await this.router.navigate(['/dashboard']);
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
      await this.router.navigate(['/dashboard']);
    }

    // Se Clerk richiede verifica email (status === 'missing_requirements')
    // si può gestire qui il flusso OTP
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
