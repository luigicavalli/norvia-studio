import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators }      from '@angular/forms';

import { CompanyService } from '../../../services/company.service';
import type { Company }   from '../../../models/company.model';
import { ToastService }   from '../../components/shared/toast/toast.service';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { InputComponent }  from '../../components/shared/input/input.component';
import { ModalComponent }  from '../../components/shared/modal/modal.component';


@Component({
  selector:    'app-companies',
  standalone:  true,
  imports:     [ReactiveFormsModule, ButtonComponent, InputComponent, ModalComponent],
  templateUrl: './companies.component.html',
  styleUrl:    './companies.component.scss',
})
export class CompaniesComponent {

  protected readonly companyService = inject(CompanyService);
  private readonly  toast           = inject(ToastService);
  private readonly  fb              = inject(FormBuilder);

  protected readonly modalOpen  = signal(false);
  protected readonly query      = signal('');
  protected readonly openMenuId = signal<string | null>(null);
  protected readonly editingId  = signal<string | null>(null);
  protected readonly saving     = signal(false);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return q
      ? this.companyService.companies().filter(c =>
          c.name.toLowerCase().includes(q)  ||
          c.city.toLowerCase().includes(q)  ||
          c.email.toLowerCase().includes(q) ||
          c.taxCode.toLowerCase().includes(q),
        )
      : this.companyService.companies();
  });

  protected readonly modalTitle = computed(() =>
    this.editingId() ? 'Modifica azienda' : 'Nuova azienda',
  );

  protected readonly form = this.fb.group({
    name:    ['', Validators.required],
    taxCode: [''],
    email:   ['', Validators.email],
    phone:   [''],
    address: [''],
    city:    [''],
    zipCode: [''],
    country: [''],
    website: [''],
  });

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.modalOpen.set(true);
  }

  protected openEdit(company: Company, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.editingId.set(company.id);
    this.form.setValue({
      name:    company.name,
      taxCode: company.taxCode,
      email:   company.email,
      phone:   company.phone,
      address: company.address,
      city:    company.city,
      zipCode: company.zipCode,
      country: company.country,
      website: company.website,
    });
    this.modalOpen.set(true);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    const data = {
      name:    v.name    ?? '',
      taxCode: v.taxCode ?? '',
      email:   v.email   ?? '',
      phone:   v.phone   ?? '',
      address: v.address ?? '',
      city:    v.city    ?? '',
      zipCode: v.zipCode ?? '',
      country: v.country ?? '',
      website: v.website ?? '',
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        const existing = this.companyService.companies().find(c => c.id === id)!;
        await this.companyService.update(id, data, existing);
        this.toast.success('Azienda aggiornata.');
      } else {
        await this.companyService.create(data);
        this.toast.success('Azienda aggiunta con successo.');
      }
      this.modalOpen.set(false);
    } catch {
      this.toast.danger('Errore durante il salvataggio.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeCompany(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await this.companyService.remove(id);
      this.openMenuId.set(null);
      this.toast.info('Azienda eliminata.');
    } catch {
      this.toast.danger('Errore durante l\'eliminazione.');
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
    if (ctrl.hasError('required')) return 'Campo obbligatorio';
    if (ctrl.hasError('email'))    return "Inserisci un'email valida";
    return '';
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
