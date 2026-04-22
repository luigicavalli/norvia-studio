import { Routes } from '@angular/router';

import { IndexComponent }   from '../feature/pages/index/index.component';
import { ShellComponent }   from '../feature/components/shell/shell.component';
import { HomeComponent }    from '../feature/pages/home/home.component';
import { AccountComponent } from '../feature/pages/account/account.component';

import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  {
    path:        '',
    component:   ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home',    component: HomeComponent    },
      { path: 'account', component: AccountComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
