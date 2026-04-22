import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../../services/auth.service';


interface StatCard {
  label: string;
  value: number;
  icon:  string;
  color: 'accent' | 'success' | 'warning' | 'danger';
}

@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [],
  templateUrl: './home.component.html',
  styleUrl:    './home.component.scss',
})
export class HomeComponent {

  private readonly auth = inject(AuthService);

  protected readonly firstName = computed(() => this.auth.user()?.firstName ?? '');

  protected readonly today = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  }).format(new Date());

  protected readonly stats: StatCard[] = [
    { label: 'Progetti attivi',    value: 0, icon: 'folder',    color: 'accent'   },
    { label: 'Task in scadenza',   value: 0, icon: 'clock',     color: 'warning'  },
    { label: 'Clienti',            value: 0, icon: 'briefcase', color: 'success'  },
    { label: 'Membri del team',    value: 1, icon: 'users',     color: 'danger'   },
  ];

}
