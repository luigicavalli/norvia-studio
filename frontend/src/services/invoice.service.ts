import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams }      from '@angular/common/http';
import { firstValueFrom }              from 'rxjs';

import { environment }              from '../environments/environment';
import { WorkspaceService }         from './workspace.service';
import type { ApiPaginatedResponse } from '../types/api.types';
import type { Invoice, InvoiceItem, InvoiceStatus, SaveInvoiceData } from '../models/invoice.model';

export type { Invoice, InvoiceItem, InvoiceStatus, SaveInvoiceData };


@Injectable({ providedIn: 'root' })
export class InvoiceService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _invoices = signal<Invoice[]>([]);
  private readonly _loading  = signal(false);
  private readonly _loaded   = signal(false);

  readonly invoices = this._invoices.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly loaded   = this._loaded.asReadonly();

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiPaginatedResponse<any>>(`${environment.apiUrl}/api/invoices`, { params }),
      );
      this._invoices.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  async create(data: SaveInvoiceData): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();
    const id  = crypto.randomUUID();

    const body = {
      id,
      workspaceId,
      clientId:   data.clientId,
      clientName: '',
      projectId:  null,
      number:     data.number,
      status:     data.status,
      issueDate:  data.issueDate?.toISOString() ?? now,
      dueDate:    data.dueDate?.toISOString()   ?? now,
      paidAt:     null,
      notes:      data.notes,
      items:      data.items.map(i => ({ ...i, invoiceId: id })),
      createdAt:  now,
      updatedAt:  now,
    };

    await firstValueFrom(this.http.post(`${environment.apiUrl}/api/invoices`, body));
    await this.load();
  }

  async update(id: string, data: SaveInvoiceData, existing: Invoice): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();

    const body = {
      id,
      workspaceId,
      clientId:   data.clientId,
      clientName: existing.clientName,
      projectId:  existing.projectId,
      number:     data.number,
      status:     data.status,
      issueDate:  data.issueDate?.toISOString() ?? now,
      dueDate:    data.dueDate?.toISOString()   ?? now,
      paidAt:     existing.paidAt?.toISOString() ?? null,
      notes:      data.notes,
      items:      data.items.map(i => ({ ...i, invoiceId: id })),
      createdAt:  existing.createdAt.toISOString(),
      updatedAt:  now,
    };

    await firstValueFrom(this.http.put(`${environment.apiUrl}/api/invoices/${id}`, body));
    await this.load();
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/api/invoices/${id}/status`, { status }),
    );
    this._invoices.update(list =>
      list.map(inv => inv.id === id ? { ...inv, status } : inv),
    );
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/invoices/${id}`));
    this._invoices.update(list => list.filter(inv => inv.id !== id));
  }

  total(invoice: Invoice): number {
    return invoice.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

  nextNumber(): number {
    const nums = this._invoices().map(inv => inv.number);
    return nums.length > 0 ? Math.max(...nums) + 1 : 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Invoice {
    return {
      id:          dto.id,
      workspaceId: dto.workspaceId,
      clientId:    dto.clientId   ?? '',
      clientName:  dto.clientName ?? '',
      projectId:   dto.projectId  ?? null,
      items:       (dto.items ?? []).map((i: InvoiceItem) => ({
        id:          i.id,
        invoiceId:   i.invoiceId,
        description: i.description ?? '',
        quantity:    i.quantity    ?? 0,
        unitPrice:   i.unitPrice   ?? 0,
        currency:    i.currency    ?? 'EUR',
      })),
      number:    dto.number   ?? 0,
      status:    (dto.status  ?? 'DRAFT') as InvoiceStatus,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
      dueDate:   dto.dueDate  ? new Date(dto.dueDate)  : null,
      paidAt:    dto.paidAt   ? new Date(dto.paidAt)   : null,
      notes:     dto.notes    ?? '',
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

}
