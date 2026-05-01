/**
 * -------
 * ANGULAR
 * -------
 */
import { inject }                                        from '@angular/core';
import { from, switchMap }                               from 'rxjs';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

/**
 * -------
 * SERVICE
 * -------
 */
import { AuthService } from '../../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (
  req:  HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);

  return from(auth.getToken()).pipe(
    switchMap(token => {
      if (!token) return next(req);

      return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }));
    }),
  );
};
