import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators }      from '@angular/forms';

import { ClientService }   from '../../../services/client.service';
import { ToastService }    from '../../components/shared/toast/toast.service';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { InputComponent }  from '../../components/shared/input/input.component';
import { ModalComponent }  from '../../components/shared/modal/modal.component';


@Component({
  selector:    'app-clients',
  standalone:  true,
  imports:     [ReactiveFormsModule, ButtonComponent, InputComponent, ModalComponent],
  templateUrl: './clients.component.html',
  styleUrl:    './clients.component.scss',
})
export class ClientsComponent {

  protected readonly clientService = inject(ClientService);
  private readonly  toast          = inject(ToastService);
  private readonly  fb             = inject(FormBuilder);

  protected readonly modalOpen  = signal(false);
  protected readonly query      = signal('');
  protected readonly openMenuId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return q
      ? this.clientService.clients().filter(c =>
          c.name.toLowerCase().includes(q)        ||
          c.contactName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
        )
      : this.clientService.clients();
  });

  protected readonly form = this.fb.group({
    name:        ['', Validators.required],
    contactName: [''],
    email:       ['', Validators.email],
    phone:       [''],
    website:     [''],
    notes:       [''],
  });

  protected openModal(): void {
    this.form.reset();
    this.modalOpen.set(true);
  }

  protected onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    this.clientService.create({
      name:        v.name        ?? '',
      contactName: v.contactName ?? '',
      email:       v.email       ?? '',
      phone:       v.phone       ?? '',
      website:     v.website     ?? '',
      notes:       v.notes       ?? '',
    });

    this.modalOpen.set(false);
    this.toast.success('Cliente aggiunto con successo.');
  }

  protected removeClient(id: string): void {
    this.clientService.remove(id);
    this.openMenuId.set(null);
    this.toast.info('Cliente eliminato.');
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
