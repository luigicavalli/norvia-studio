/**
 * -------
 * ANGULAR
 * -------
 */
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter }                       from '@angular/router';

/**
 * --------
 * SERVICES
 * --------
 */
import { AuthService }    from '../services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes }          from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    {
      provide:    APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => auth.init(),
      deps:       [AuthService],
      multi:      true,
    },
  ],
};
