import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators }      from '@angular/forms';
import { TranslatePipe, TranslateService }                   from '@ngx-translate/core';

import { ClientService }  from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import type { Client }    from '../../../models/client.model';
import { ToastService }   from '../../components/shared/toast/toast.service';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { InputComponent }  from '../../components/shared/input/input.component';
import { ModalComponent }  from '../../components/shared/modal/modal.component';
import { SelectComponent } from '../../components/shared/select/select.component';


@Component({
  selector:    'app-clients',
  standalone:  true,
  imports:     [ReactiveFormsModule, TranslatePipe, ButtonComponent, InputComponent, ModalComponent, SelectComponent],
  templateUrl: './clients.component.html',
  styleUrl:    './clients.component.scss',
})
export class ClientsComponent {

  protected readonly clientService  = inject(ClientService);
  protected readonly companyService = inject(CompanyService);
  private readonly  toast           = inject(ToastService);
  private readonly  fb              = inject(FormBuilder);
  private readonly  translate       = inject(TranslateService);

  protected readonly modalOpen  = signal(false);
  protected readonly query      = signal('');
  protected readonly openMenuId = signal<string | null>(null);
  protected readonly editingId  = signal<string | null>(null);
  protected readonly saving     = signal(false);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return q
      ? this.clientService.clients().filter(c =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)    ||
          (c.companyName ?? '').toLowerCase().includes(q),
        )
      : this.clientService.clients();
  });

  protected readonly modalTitle = computed(() =>
    this.translate.instant(this.editingId() ? 'CLIENTS.MODAL_TITLE_EDIT' : 'CLIENTS.MODAL_TITLE_CREATE'),
  );

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', Validators.email],
    phone:     [''],
    notes:     [''],
    companyId: ['' as string | null],
  });

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.modalOpen.set(true);
  }

  protected openEdit(client: Client, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.editingId.set(client.id);
    this.form.setValue({
      firstName: client.firstName,
      lastName:  client.lastName,
      email:     client.email,
      phone:     client.phone,
      notes:     client.notes,
      companyId: client.companyId ?? '',
    });
    this.modalOpen.set(true);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    const data = {
      firstName: v.firstName ?? '',
      lastName:  v.lastName  ?? '',
      email:     v.email     ?? '',
      phone:     v.phone     ?? '',
      notes:     v.notes     ?? '',
      companyId: v.companyId || null,
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        const existing = this.clientService.clients().find(c => c.id === id)!;
        await this.clientService.update(id, data, existing);
        this.toast.success(this.translate.instant('CLIENTS.TOAST.UPDATED'));
      } else {
        await this.clientService.create(data);
        this.toast.success(this.translate.instant('CLIENTS.TOAST.CREATED'));
      }
      this.modalOpen.set(false);
    } catch {
      this.toast.danger(this.translate.instant('CLIENTS.TOAST.SAVE_ERROR'));
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeClient(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await this.clientService.remove(id);
      this.openMenuId.set(null);
      this.toast.info(this.translate.instant('CLIENTS.TOAST.DELETED'));
    } catch {
      this.toast.danger(this.translate.instant('CLIENTS.TOAST.DELETE_ERROR'));
    }
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update(current => current === id ? null : id);
  }

  protected initials(name: string): string {
    const words = name.trim().split(/\s+/);
    return words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }

  protected fieldError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    if (ctrl.hasError('required')) return this.translate.instant('VALIDATION.REQUIRED');
    if (ctrl.hasError('email'))    return this.translate.instant('VALIDATION.EMAIL');
    return '';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
