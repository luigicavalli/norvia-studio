import { TestBed }        from '@angular/core/testing';
import { provideRouter }  from '@angular/router';
import { signal }         from '@angular/core';

import { authGuard }   from './auth.guard';
import { AuthService } from '../../services/auth.service';


describe('authGuard', () => {

  const isSignedIn = signal(false);
  const fakeAuth   = { isSignedIn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: fakeAuth },
      ],
    });
  });

  it('should return true when user is signed in', () => {
    isSignedIn.set(true);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );
    expect(result).toBe(true);
  });

  it('should return a UrlTree redirecting to / when not signed in', () => {
    isSignedIn.set(false);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );
    expect(result).not.toBe(true);
    expect((result as any).root.children.primary?.segments[0]?.path ?? '')
      .toBe('');
  });

  it('should deny access when isSignedIn flips to false', () => {
    isSignedIn.set(true);
    const pass = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );
    expect(pass).toBe(true);

    isSignedIn.set(false);
    const deny = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );
    expect(deny).not.toBe(true);
  });

});
