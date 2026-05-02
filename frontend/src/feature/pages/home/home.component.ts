import { Component, computed, inject } from '@angular/core';

import { AuthService }    from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { ClientService }  from '../../../services/client.service';


@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [],
  templateUrl: './home.component.html',
  styleUrl:    './home.component.scss',
})
export class HomeComponent {

  private readonly auth           = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly clientService  = inject(ClientService);

  protected readonly firstName = computed(() => this.auth.user()?.firstName ?? '');

  protected readonly today = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  }).format(new Date());

  protected readonly loading = computed(() =>
    !this.projectService.loaded() || !this.clientService.loaded(),
  );

  protected readonly activeProjects = computed(() => this.projectService.activeCount());
  protected readonly totalClients   = computed(() => this.clientService.total());
  protected readonly onHoldProjects = computed(() => this.projectService.onHoldCount());
  protected readonly completedCount = computed(() => this.projectService.completedCount());

}
