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
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader }               from '@ngx-translate/http-loader';
import { firstValueFrom }                           from 'rxjs';

const SUPPORTED_LANGS = ['it', 'en'];

function resolveLang(preferred: string): string {
  const base = preferred.split('-')[0];
  return SUPPORTED_LANGS.includes(base) ? base : 'it';
}

import { routes }          from './app.routes';
import { AuthService }     from '../services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';


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
    provideAppInitializer(async () => {
      const auth      = inject(AuthService);
      const translate = inject(TranslateService);

      await auth.init();

      const lang = auth.isSignedIn()
        ? resolveLang(auth.getPreferences().language)
        : resolveLang(navigator.language);

      await firstValueFrom(translate.use(lang));
    }),
    provideAppInitializer(() => { inject(Sentry.TraceService); }),
  ],
};
