import * as Sentry from '@sentry/angular';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig }            from './app/app.config';
import { App }                  from './app/app';
import { environment }          from './environments/environment';


Sentry.init({
  dsn:              environment.sentryDsn || undefined,
  environment:      environment.production ? 'production' : 'development',
  tracesSampleRate: 1.0,
  integrations:     [Sentry.browserTracingIntegration()],
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
