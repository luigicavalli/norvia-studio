import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet }              from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SidebarComponent }   from '../sidebar/sidebar.component';
import { ToastComponent }     from '../shared/toast/toast.component';
import { ButtonComponent }    from '../shared/button/button.component';
import { InputComponent }     from '../shared/input/input.component';
import { WorkspaceService }   from '../../../services/workspace.service';
import { ClientService }      from '../../../services/client.service';
import { CompanyService }     from '../../../services/company.service';
import { ProjectService }     from '../../../services/project.service';
import { TeamService }        from '../../../services/team.service';
import { AssignmentService } from '../../../services/assignment.service';
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
  private   readonly companyService   = inject(CompanyService);
  private   readonly projectService   = inject(ProjectService);
  private   readonly teamService        = inject(TeamService);
  private   readonly assignmentService  = inject(AssignmentService);
  private   readonly toast            = inject(ToastService);
  private   readonly fb               = inject(FormBuilder);

  protected readonly setupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  protected readonly saving = signal(false);

  private initialized = false;

  constructor() {
    effect(() => {
      const id = this.workspaceService.activeId();
      if (!id || !this.initialized) return;
      Promise.all([
        this.clientService.load(),
        this.companyService.load(),
        this.projectService.load(),
        this.teamService.load(),
        this.assignmentService.load(id),
      ]);
    });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.workspaceService.load(),
      this.teamService.activateSelf(),
    ]);
    if (this.workspaceService.hasWorkspace()) {
      const id = this.workspaceService.activeId()!;
      await Promise.all([
        this.clientService.load(),
        this.companyService.load(),
        this.projectService.load(),
        this.teamService.load(),
        this.assignmentService.load(id),
      ]);
    }
    this.initialized = true;
  }

  protected async onCreateWorkspace(): Promise<void> {
    if (this.setupForm.invalid) { this.setupForm.markAllAsTouched(); return; }

    this.saving.set(true);
    try {
      await this.workspaceService.create(this.setupForm.value.name!);
      const id = this.workspaceService.activeId()!;
      await Promise.all([
        this.clientService.load(),
        this.companyService.load(),
        this.projectService.load(),
        this.teamService.load(),
        this.assignmentService.load(id),
      ]);
      this.toast.success('Workspace creato con successo!');
    } catch {
      this.toast.danger('Errore durante la creazione del workspace.');
    } finally {
      this.saving.set(false);
    }
  }

}
