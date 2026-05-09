import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink }                                        from '@angular/router';
import { DecimalPipe }                                       from '@angular/common';

import { ProjectService }                                          from '../../../services/project.service';
import type { Project, ProjectStatus, ProjectPriority, SaveProjectData } from '../../../models/project.model';
import { ClientService }        from '../../../services/client.service';
import { WorkspaceService }     from '../../../services/workspace.service';
import { TeamService }          from '../../../services/team.service';
import { AssignmentService }    from '../../../services/assignment.service';
import type { Assignment }      from '../../../models/assignment.model';
import { ToastService }         from '../../components/shared/toast/toast.service';
import { ButtonComponent }      from '../../components/shared/button/button.component';
import { InputComponent }       from '../../components/shared/input/input.component';
import { SelectComponent }      from '../../components/shared/select/select.component';
import { ModalComponent }       from '../../components/shared/modal/modal.component';
import { BadgeComponent }       from '../../components/shared/badge/badge.component';
import { AvatarComponent }     from '../../components/shared/avatar/avatar.component';
import { DatepickerComponent }  from '../../components/shared/datepicker/datepicker.component';
import { SelectOption }         from '../../components/shared/select/select.types';
import { BadgeVariant }         from '../../components/shared/badge/badge.component';


type FilterTab = 'all' | ProjectStatus;

@Component({
  selector:    'app-projects',
  standalone:  true,
  imports:     [ReactiveFormsModule, FormsModule, RouterLink, DecimalPipe, ButtonComponent, InputComponent,
                SelectComponent, ModalComponent, BadgeComponent, DatepickerComponent, AvatarComponent],
  templateUrl: './projects.component.html',
  styleUrl:    './projects.component.scss',
})
export class ProjectsComponent {

  protected readonly projectService    = inject(ProjectService);
  protected readonly clientService     = inject(ClientService);
  protected readonly teamService       = inject(TeamService);
  protected readonly assignmentService  = inject(AssignmentService);
  private readonly  workspaceService   = inject(WorkspaceService);
  private readonly  toast              = inject(ToastService);
  private readonly  fb                 = inject(FormBuilder);

  protected readonly modalOpen    = signal(false);
  protected readonly activeTab    = signal<FilterTab>('all');
  protected readonly openMenuId   = signal<string | null>(null);
  protected readonly editingId    = signal<string | null>(null);
  protected readonly saving       = signal(false);

  // Assignment modal
  protected readonly assignModalProject = signal<Project | null>(null);
  protected readonly assignments        = signal<Assignment[]>([]);
  protected readonly assigningSaving    = signal(false);
  protected readonly selectedMemberId   = signal<string>('');

  protected readonly statusOptions: SelectOption[] = [
    { value: 'ACTIVE',    label: 'Attivo'     },
    { value: 'ON_HOLD',   label: 'In pausa'   },
    { value: 'COMPLETED', label: 'Completato' },
    { value: 'DRAFT',     label: 'Bozza'      },
    { value: 'CANCELLED', label: 'Annullato'  },
  ];

  protected readonly priorityOptions: SelectOption[] = [
    { value: 'LOW',      label: 'Bassa'   },
    { value: 'MEDIUM',   label: 'Media'   },
    { value: 'HIGH',     label: 'Alta'    },
    { value: 'CRITICAL', label: 'Critica' },
  ];

  protected readonly currencyOptions: SelectOption[] = [
    { value: 'EUR', label: 'EUR €' },
    { value: 'USD', label: 'USD $' },
    { value: 'GBP', label: 'GBP £' },
  ];

  protected readonly tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',       label: 'Tutti'      },
    { key: 'ACTIVE',    label: 'Attivi'     },
    { key: 'ON_HOLD',   label: 'In pausa'   },
    { key: 'COMPLETED', label: 'Completati' },
  ];

  protected readonly clientOptions = computed<SelectOption[]>(() =>
    this.clientService.clients().map(c => ({ value: c.id, label: c.fullName })),
  );

  protected readonly filtered = computed(() => {
    const tab = this.activeTab();
    return tab === 'all'
      ? this.projectService.projects()
      : this.projectService.projects().filter(p => p.status === tab);
  });

  protected readonly modalTitle = computed(() =>
    this.editingId() ? 'Modifica progetto' : 'Nuovo progetto',
  );

  protected readonly form = this.fb.group({
    name:           ['', Validators.required],
    description:    [''],
    clientId:       ['' as string],
    status:         ['ACTIVE' as ProjectStatus, Validators.required],
    priority:       ['MEDIUM' as ProjectPriority, Validators.required],
    budgetAmount:   [null as number | null],
    budgetCurrency: ['EUR'],
    startDate:      [null as Date | null],
    dueDate:        [null as Date | null],
  });

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ status: 'ACTIVE', priority: 'MEDIUM', budgetCurrency: 'EUR' });
    this.modalOpen.set(true);
  }

  protected openEdit(project: Project, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.editingId.set(project.id);
    this.form.setValue({
      name:           project.name,
      description:    project.description,
      clientId:       project.clientId,
      status:         project.status,
      priority:       project.priority,
      budgetAmount:   project.budgetAmount,
      budgetCurrency: project.budgetCurrency,
      startDate:      project.startDate,
      dueDate:        project.dueDate,
    });
    this.modalOpen.set(true);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v        = this.form.value;
    const clientId = v.clientId ?? '';
    const client   = this.clientService.clients().find(c => c.id === clientId);

    if (!client) {
      this.toast.warning('Seleziona un cliente.');
      return;
    }

    const data: SaveProjectData = {
      name:           v.name!,
      description:    v.description   ?? '',
      client,
      status:         v.status        as ProjectStatus,
      priority:       v.priority      as ProjectPriority,
      budgetAmount:   v.budgetAmount  ?? null,
      budgetCurrency: v.budgetCurrency ?? 'EUR',
      startDate:      v.startDate     ?? null,
      dueDate:        v.dueDate       ?? null,
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        const existing = this.projectService.projects().find(p => p.id === id)!;
        await this.projectService.update(id, data, existing);
        this.toast.success('Progetto aggiornato.');
      } else {
        await this.projectService.create(data);
        this.toast.success('Progetto creato con successo.');
      }
      this.modalOpen.set(false);
    } catch {
      this.toast.danger('Errore durante il salvataggio del progetto.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeProject(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await this.projectService.remove(id);
      this.openMenuId.set(null);
      this.toast.info('Progetto eliminato.');
    } catch {
      this.toast.danger('Errore durante l\'eliminazione.');
    }
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update(current => current === id ? null : id);
  }

  protected statusBadge(status: ProjectStatus): { label: string; variant: BadgeVariant } {
    const map: Record<string, { label: string; variant: BadgeVariant }> = {
      ACTIVE:    { label: 'Attivo',      variant: 'success' },
      ON_HOLD:   { label: 'In pausa',    variant: 'warning' },
      COMPLETED: { label: 'Completato',  variant: 'default' },
      DRAFT:     { label: 'Bozza',       variant: 'default' },
      CANCELLED: { label: 'Annullato',   variant: 'danger'  },
      UNKNOWN:   { label: 'Sconosciuto', variant: 'default' },
    };
    return map[status] ?? { label: status, variant: 'default' };
  }

  protected formatDate(date: Date | null): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  protected readonly assignableMembers = computed<SelectOption[]>(() => {
    const assigned = new Set(this.assignments().map(a => a.teamMemberId));
    return this.teamService.active()
      .filter(m => !assigned.has(m.id))
      .map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}`.trim() || m.email }));
  });

  protected async openAssignModal(project: Project, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.assignModalProject.set(project);
    this.selectedMemberId.set('');
    // Prende i dati già in cache dal signal globale
    this.assignments.set(this.assignmentService.byProject().get(project.id) ?? []);
  }

  protected async addAssignment(): Promise<void> {
    const project  = this.assignModalProject();
    const memberId = this.selectedMemberId();
    if (!project || !memberId) return;

    this.assigningSaving.set(true);
    try {
      const workspaceId = this.workspaceService.activeId()!;
      await this.assignmentService.create(project.id, memberId, workspaceId);
      const list = await this.assignmentService.getByProject(project.id, workspaceId);
      this.assignments.set(list);
      this.assignmentService.updateLocalCache(project.id, list);
      this.selectedMemberId.set('');
      this.toast.success('Membro assegnato.');
    } catch {
      this.toast.danger('Errore durante l\'assegnazione.');
    } finally {
      this.assigningSaving.set(false);
    }
  }

  protected async removeAssignment(assignmentId: string): Promise<void> {
    try {
      await this.assignmentService.remove(assignmentId);
      const updated = this.assignments().filter(a => a.id !== assignmentId);
      this.assignments.set(updated);
      const project = this.assignModalProject();
      if (project) this.assignmentService.updateLocalCache(project.id, updated);
      this.toast.info('Assegnazione rimossa.');
    } catch {
      this.toast.danger('Errore durante la rimozione.');
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
