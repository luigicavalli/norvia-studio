import { Routes } from '@angular/router';

import { IndexComponent }   from '../feature/pages/index/index.component';
import { ShellComponent }   from '../feature/components/shell/shell.component';
import { HomeComponent }    from '../feature/pages/home/home.component';
import { AccountComponent }  from '../feature/pages/account/account.component';
import { SettingsComponent }  from '../feature/pages/settings/settings.component';
import { ProjectsComponent }  from '../feature/pages/projects/projects.component';
import { ClientsComponent }   from '../feature/pages/clients/clients.component';
import { CompaniesComponent } from '../feature/pages/companies/companies.component';
import { TeamComponent }      from '../feature/pages/team/team.component';
import { QuotesComponent }   from '../feature/pages/quotes/quotes.component';
import { InvoicesComponent } from '../feature/pages/invoices/invoices.component';

import { authGuard }  from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';


export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full', canActivate: [guestGuard] },
  {
    path:        '',
    component:   ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home',     component: HomeComponent     },
      { path: 'account',  component: AccountComponent  },
      { path: 'settings', component: SettingsComponent },
      { path: 'projects',  component: ProjectsComponent  },
      { path: 'clients',   component: ClientsComponent   },
      { path: 'companies', component: CompaniesComponent },
      { path: 'team',      component: TeamComponent      },
      { path: 'quotes',    component: QuotesComponent    },
      { path: 'invoices',  component: InvoicesComponent  },
    ],
  },
  { path: '**', redirectTo: '' },
];
