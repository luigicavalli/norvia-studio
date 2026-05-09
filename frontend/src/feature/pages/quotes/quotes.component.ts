import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe }                                              from '@angular/common';

import { QuoteService }   from '../../../services/quote.service';
import { ClientService }  from '../../../services/client.service';
import type { Quote, QuoteStatus, SaveQuoteData, SaveQuoteItemData } from '../../../models/quote.model';
import { ToastService }         from '../../components/shared/toast/toast.service';
import { ButtonComponent }      from '../../components/shared/button/button.component';
import { InputComponent }       from '../../components/shared/input/input.component';
import { SelectComponent }      from '../../components/shared/select/select.component';
import { ModalComponent }       from '../../components/shared/modal/modal.component';
import { BadgeComponent }       from '../../components/shared/badge/badge.component';
import { DatepickerComponent }  from '../../components/shared/datepicker/datepicker.component';
import { SelectOption }         from '../../components/shared/select/select.types';
import { BadgeVariant }         from '../../components/shared/badge/badge.component';


@Component({
  selector:    'app-quotes',
  standalone:  true,
  imports:     [ReactiveFormsModule, DecimalPipe, ButtonComponent, InputComponent,
                SelectComponent, ModalComponent, BadgeComponent, DatepickerComponent],
  templateUrl: './quotes.component.html',
  styleUrl:    './quotes.component.scss',
})
export class QuotesComponent {

  protected readonly quoteService  = inject(QuoteService);
  protected readonly clientService = inject(ClientService);
  private readonly  toast          = inject(ToastService);
  private readonly  fb             = inject(FormBuilder);

  protected readonly modalOpen  = signal(false);
  protected readonly openMenuId = signal<string | null>(null);
  protected readonly editingId  = signal<string | null>(null);
  protected readonly saving     = signal(false);

  protected readonly statusOptions: SelectOption[] = [
    { value: 'DRAFT',    label: 'Bozza'     },
    { value: 'SENT',     label: 'Inviato'   },
    { value: 'ACCEPTED', label: 'Accettato' },
    { value: 'REJECTED', label: 'Rifiutato' },
    { value: 'EXPIRED',  label: 'Scaduto'   },
  ];

  protected readonly currencyOptions: SelectOption[] = [
    { value: 'EUR', label: 'EUR €' },
    { value: 'USD', label: 'USD $' },
    { value: 'GBP', label: 'GBP £' },
  ];

  protected readonly clientOptions = computed<SelectOption[]>(() =>
    this.clientService.clients().map(c => ({ value: c.id, label: c.fullName })),
  );

  protected readonly modalTitle = computed(() =>
    this.editingId() ? 'Modifica preventivo' : 'Nuovo preventivo',
  );

  protected readonly form = this.fb.group({
    clientId:  ['', Validators.required],
    number:    [this.quoteService.nextNumber(), [Validators.required, Validators.min(1)]],
    status:    ['DRAFT' as QuoteStatus, Validators.required],
    issueDate: [null as Date | null, Validators.required],
    expiresAt: [null as Date | null, Validators.required],
    notes:     [''],
    items:     this.fb.array([]),
  });

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  protected addItem(): void {
    this.itemsArray.push(this.fb.group({
      id:          [crypto.randomUUID()],
      description: ['', Validators.required],
      quantity:    [1, [Validators.required, Validators.min(0.01)]],
      unitPrice:   [0, [Validators.required, Validators.min(0)]],
      currency:    ['EUR', Validators.required],
    }));
  }

  protected removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.itemsArray.clear();
    this.form.reset({ status: 'DRAFT', number: this.quoteService.nextNumber() });
    this.addItem();
    this.modalOpen.set(true);
  }

  protected openEdit(quote: Quote, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.editingId.set(quote.id);
    this.itemsArray.clear();

    this.form.patchValue({
      clientId:  quote.clientId,
      number:    quote.number,
      status:    quote.status,
      issueDate: quote.issueDate,
      expiresAt: quote.expiresAt,
      notes:     quote.notes,
    });

    for (const item of quote.items) {
      this.itemsArray.push(this.fb.group({
        id:          [item.id],
        description: [item.description, Validators.required],
        quantity:    [item.quantity,    [Validators.required, Validators.min(0.01)]],
        unitPrice:   [item.unitPrice,   [Validators.required, Validators.min(0)]],
        currency:    [item.currency,    Validators.required],
      }));
    }

    if (this.itemsArray.length === 0) this.addItem();
    this.modalOpen.set(true);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;

    const data: SaveQuoteData = {
      clientId:  v.clientId!,
      number:    v.number!,
      status:    v.status as QuoteStatus,
      issueDate: v.issueDate ?? null,
      expiresAt: v.expiresAt ?? null,
      notes:     v.notes ?? '',
      items:     (v.items as SaveQuoteItemData[]) ?? [],
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        const existing = this.quoteService.quotes().find(q => q.id === id)!;
        await this.quoteService.update(id, data, existing);
        this.toast.success('Preventivo aggiornato.');
      } else {
        await this.quoteService.create(data);
        this.toast.success('Preventivo creato con successo.');
      }
      this.modalOpen.set(false);
    } catch {
      this.toast.danger('Errore durante il salvataggio del preventivo.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeQuote(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await this.quoteService.remove(id);
      this.openMenuId.set(null);
      this.toast.info('Preventivo eliminato.');
    } catch {
      this.toast.danger('Errore durante l\'eliminazione.');
    }
  }

  protected async changeStatus(quote: Quote, status: QuoteStatus, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    this.openMenuId.set(null);
    try {
      await this.quoteService.updateStatus(quote.id, status);
      this.toast.success('Stato aggiornato.');
    } catch {
      this.toast.danger('Errore durante l\'aggiornamento dello stato.');
    }
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update(cur => cur === id ? null : id);
  }

  protected statusBadge(status: QuoteStatus): { label: string; variant: BadgeVariant } {
    const map: Record<QuoteStatus, { label: string; variant: BadgeVariant }> = {
      DRAFT:    { label: 'Bozza',     variant: 'default' },
      SENT:     { label: 'Inviato',   variant: 'info'    },
      ACCEPTED: { label: 'Accettato', variant: 'success' },
      REJECTED: { label: 'Rifiutato', variant: 'danger'  },
      EXPIRED:  { label: 'Scaduto',   variant: 'warning' },
    };
    return map[status] ?? { label: status, variant: 'default' };
  }

  protected formatDate(date: Date | null): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  protected rowTotal(index: number): number {
    const item = this.itemsArray.at(index).value;
    return (item.quantity ?? 0) * (item.unitPrice ?? 0);
  }

  protected formTotal(): number {
    return this.itemsArray.controls.reduce((sum, ctrl) => {
      const v = ctrl.value;
      return sum + (v.quantity ?? 0) * (v.unitPrice ?? 0);
    }, 0);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

}
