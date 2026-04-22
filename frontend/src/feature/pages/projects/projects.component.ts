import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators }      from '@angular/forms';

import { ProjectService, ProjectStatus } from '../../../services/project.service';
import { ToastService }    from '../../components/shared/toast/toast.service';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { InputComponent }  from '../../components/shared/input/input.component';
import { SelectComponent } from '../../components/shared/select/select.component';
import { ModalComponent }  from '../../components/shared/modal/modal.component';
import { BadgeComponent }  from '../../components/shared/badge/badge.component';
import { DatepickerComponent } from '../../components/shared/datepicker/datepicker.component';
import { SelectOption }    from '../../components/shared/select/select.types';
import { BadgeVariant }    from '../../components/shared/badge/badge.component';


type FilterTab = 'all' | ProjectStatus;

@Component({
  selector:    'app-projects',
  standalone:  true,
  imports:     [ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent,
                ModalComponent, BadgeComponent, DatepickerComponent],
  templateUrl: './projects.component.html',
  styleUrl:    './projects.component.scss',
})
export class ProjectsComponent {

  protected readonly projectService = inject(ProjectService);
  private readonly toast          = inject(ToastService);
  private readonly fb             = inject(FormBuilder);

  protected readonly modalOpen  = signal(false);
  protected readonly activeTab  = signal<FilterTab>('all');
  protected readonly openMenuId = signal<string | null>(null);
  protected          saving     = false;

  protected readonly statusOptions: SelectOption[] = [
    { value: 'active',    label: 'Attivo'     },
    { value: 'paused',    label: 'In pausa'   },
    { value: 'completed', label: 'Completato' },
  ];

  protected readonly tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',       label: 'Tutti'      },
    { key: 'active',    label: 'Attivi'     },
    { key: 'paused',    label: 'In pausa'   },
    { key: 'completed', label: 'Completati' },
  ];

  protected readonly filtered = computed(() => {
    const tab = this.activeTab();
    return tab === 'all'
      ? this.projectService.projects()
      : this.projectService.projects().filter(p => p.status === tab);
  });

  protected readonly form = this.fb.group({
    name:        ['', Validators.required],
    description: [''],
    clientName:  [''],
    status:      ['active' as ProjectStatus, Validators.required],
    dueDate:     [null as Date | null],
  });

  protected openModal(): void {
    this.form.reset({ status: 'active' });
    this.modalOpen.set(true);
  }

  protected onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    this.projectService.create({
      name:        v.name!,
      description: v.description ?? '',
      clientName:  v.clientName  ?? '',
      status:      v.status      as ProjectStatus,
      dueDate:     v.dueDate     ?? null,
    });

    this.modalOpen.set(false);
    this.toast.success('Progetto creato con successo.');
  }

  protected removeProject(id: string): void {
    this.projectService.remove(id);
    this.openMenuId.set(null);
    this.toast.info('Progetto eliminato.');
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update(current => current === id ? null : id);
  }

  protected statusBadge(status: ProjectStatus): { label: string; variant: BadgeVariant } {
    const map: Record<ProjectStatus, { label: string; variant: BadgeVariant }> = {
      active:    { label: 'Attivo',     variant: 'success' },
      paused:    { label: 'In pausa',   variant: 'warning' },
      completed: { label: 'Completato', variant: 'default' },
    };
    return map[status];
  }

  protected formatDate(date: Date | null): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
