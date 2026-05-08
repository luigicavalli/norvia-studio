import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet }              from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SidebarComponent }   from '../sidebar/sidebar.component';
import { ToastComponent }     from '../shared/toast/toast.component';
import { ButtonComponent }    from '../shared/button/button.component';
import { InputComponent }     from '../shared/input/input.component';
import { WorkspaceService }   from '../../../services/workspace.service';
import { ClientService }      from '../../../services/client.service';
import { ProjectService }     from '../../../services/project.service';
import { TeamService }        from '../../../services/team.service';
import { ToastService }       from '../shared/toast/toast.service';


@Component({
  selector:    'app-shell',
  standalone:  true,
  imports:     [RouterOutlet, SidebarComponent, ToastComponent,
                ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './shell.component.html',
  styleUrl:    './shell.component.scss',
})
export class ShellComponent implements OnInit {

  protected readonly workspaceService = inject(WorkspaceService);
  private   readonly clientService    = inject(ClientService);
  private   readonly projectService   = inject(ProjectService);
  private   readonly teamService      = inject(TeamService);
  private   readonly toast            = inject(ToastService);
  private   readonly fb               = inject(FormBuilder);

  protected readonly setupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  protected readonly saving = signal(false);

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.workspaceService.load(),
      this.teamService.activateSelf(),
    ]);
    if (this.workspaceService.hasWorkspace()) {
      await Promise.all([
        this.clientService.load(),
        this.projectService.load(),
        this.teamService.load(),
      ]);
    }
  }

  protected async onCreateWorkspace(): Promise<void> {
    if (this.setupForm.invalid) { this.setupForm.markAllAsTouched(); return; }

    this.saving.set(true);
    try {
      await this.workspaceService.create(this.setupForm.value.name!);
      await Promise.all([
        this.clientService.load(),
        this.projectService.load(),
        this.teamService.load(),
      ]);
      this.toast.success('Workspace creato con successo!');
    } catch {
      this.toast.danger('Errore durante la creazione del workspace.');
    } finally {
      this.saving.set(false);
    }
  }

}
