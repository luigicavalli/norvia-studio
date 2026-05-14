import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Router }               from '@angular/router';
import * as Sentry                             from '@sentry/angular';
import { provideTranslateService }             from '@ngx-translate/core';
import { provideTranslateHttpLoader }          from '@ngx-translate/http-loader';

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
    provideTranslateService({ lang: 'it' }),
    provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
    { provide: Sentry.TraceService, deps: [Router] },
    provideAppInitializer(() => inject(AuthService).init()),
    provideAppInitializer(() => { inject(Sentry.TraceService); }),
  ],
};
