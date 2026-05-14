import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink }                                        from '@angular/router';
import { DecimalPipe }                                       from '@angular/common';
import { TranslatePipe, TranslateService }                   from '@ngx-translate/core';

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
  imports:     [ReactiveFormsModule, FormsModule, RouterLink, DecimalPipe, TranslatePipe, ButtonComponent,
                InputComponent, SelectComponent, ModalComponent, BadgeComponent, DatepickerComponent, AvatarComponent],
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
  private readonly  translate          = inject(TranslateService);

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
    { value: 'ACTIVE',    label: this.translate.instant('PROJECTS.STATUS.ACTIVE')    },
    { value: 'ON_HOLD',   label: this.translate.instant('PROJECTS.STATUS.ON_HOLD')   },
    { value: 'COMPLETED', label: this.translate.instant('PROJECTS.STATUS.COMPLETED') },
    { value: 'DRAFT',     label: this.translate.instant('PROJECTS.STATUS.DRAFT')     },
    { value: 'CANCELLED', label: this.translate.instant('PROJECTS.STATUS.CANCELLED') },
  ];

  protected readonly priorityOptions: SelectOption[] = [
    { value: 'LOW',      label: this.translate.instant('PROJECTS.PRIORITY.LOW')      },
    { value: 'MEDIUM',   label: this.translate.instant('PROJECTS.PRIORITY.MEDIUM')   },
    { value: 'HIGH',     label: this.translate.instant('PROJECTS.PRIORITY.HIGH')     },
    { value: 'CRITICAL', label: this.translate.instant('PROJECTS.PRIORITY.CRITICAL') },
  ];

  protected readonly currencyOptions: SelectOption[] = [
    { value: 'EUR', label: 'EUR €' },
    { value: 'USD', label: 'USD $' },
    { value: 'GBP', label: 'GBP £' },
  ];

  protected readonly tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',       label: this.translate.instant('PROJECTS.TABS.ALL')       },
    { key: 'ACTIVE',    label: this.translate.instant('PROJECTS.TABS.ACTIVE')    },
    { key: 'ON_HOLD',   label: this.translate.instant('PROJECTS.TABS.ON_HOLD')   },
    { key: 'COMPLETED', label: this.translate.instant('PROJECTS.TABS.COMPLETED') },
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
    this.translate.instant(this.editingId() ? 'PROJECTS.MODAL_TITLE_EDIT' : 'PROJECTS.MODAL_TITLE_CREATE'),
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
      this.toast.warning(this.translate.instant('PROJECTS.TOAST.SELECT_CLIENT'));
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
        this.toast.success(this.translate.instant('PROJECTS.TOAST.UPDATED'));
      } else {
        await this.projectService.create(data);
        this.toast.success(this.translate.instant('PROJECTS.TOAST.CREATED'));
      }
      this.modalOpen.set(false);
    } catch {
      this.toast.danger(this.translate.instant('PROJECTS.TOAST.SAVE_ERROR'));
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeProject(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await this.projectService.remove(id);
      this.openMenuId.set(null);
      this.toast.info(this.translate.instant('PROJECTS.TOAST.DELETED'));
    } catch {
      this.toast.danger(this.translate.instant('PROJECTS.TOAST.DELETE_ERROR'));
    }
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update(current => current === id ? null : id);
  }

  protected statusBadge(status: ProjectStatus): { label: string; variant: BadgeVariant } {
    const variants: Record<string, BadgeVariant> = {
      ACTIVE:    'success',
      ON_HOLD:   'warning',
      COMPLETED: 'default',
      DRAFT:     'default',
      CANCELLED: 'danger',
    };
    return {
      label:   this.translate.instant(`PROJECTS.STATUS.${status}`, undefined) || status,
      variant: variants[status] ?? 'default',
    };
  }

  protected formatDate(date: Date | null): string {
    if (!date) return '—';
    const locale = this.translate.getCurrentLang() === 'en' ? 'en-GB' : 'it-IT';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
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
      this.toast.success(this.translate.instant('PROJECTS.TOAST.MEMBER_ADDED'));
    } catch {
      this.toast.danger(this.translate.instant('PROJECTS.TOAST.MEMBER_ADD_ERROR'));
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
      this.toast.info(this.translate.instant('PROJECTS.TOAST.MEMBER_REMOVED'));
    } catch {
      this.toast.danger(this.translate.instant('PROJECTS.TOAST.MEMBER_REMOVE_ERROR'));
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
