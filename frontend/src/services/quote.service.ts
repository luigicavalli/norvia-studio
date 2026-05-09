import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams }      from '@angular/common/http';
import { firstValueFrom }              from 'rxjs';

import { environment }              from '../environments/environment';
import { WorkspaceService }         from './workspace.service';
import type { ApiPaginatedResponse } from '../types/api.types';
import type { Quote, QuoteStatus, SaveQuoteData } from '../models/quote.model';

export type { Quote, QuoteStatus, SaveQuoteData };


@Injectable({ providedIn: 'root' })
export class QuoteService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _quotes  = signal<Quote[]>([]);
  private readonly _loading = signal(false);
  private readonly _loaded  = signal(false);

  readonly quotes  = this._quotes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded  = this._loaded.asReadonly();

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiPaginatedResponse<any>>(`${environment.apiUrl}/api/quotes`, { params }),
      );
      this._quotes.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  async create(data: SaveQuoteData): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();
    const id  = crypto.randomUUID();

    const body = {
      id,
      workspaceId,
      clientId:   data.clientId,
      clientName: '',
      number:     data.number,
      status:     data.status,
      issueDate:  data.issueDate?.toISOString() ?? now,
      expiresAt:  data.expiresAt?.toISOString() ?? now,
      notes:      data.notes,
      items:      data.items.map(i => ({ ...i, quoteId: id })),
      createdAt:  now,
      updatedAt:  now,
    };

    await firstValueFrom(this.http.post(`${environment.apiUrl}/api/quotes`, body));
    await this.load();
  }

  async update(id: string, data: SaveQuoteData, existing: Quote): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();

    const body = {
      id,
      workspaceId,
      clientId:   data.clientId,
      clientName: existing.clientName,
      number:     data.number,
      status:     data.status,
      issueDate:  data.issueDate?.toISOString() ?? now,
      expiresAt:  data.expiresAt?.toISOString() ?? now,
      notes:      data.notes,
      items:      data.items.map(i => ({ ...i, quoteId: id })),
      createdAt:  existing.createdAt.toISOString(),
      updatedAt:  now,
    };

    await firstValueFrom(this.http.put(`${environment.apiUrl}/api/quotes/${id}`, body));
    await this.load();
  }

  async updateStatus(id: string, status: QuoteStatus): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/api/quotes/${id}/status`, { status }),
    );
    this._quotes.update(list =>
      list.map(q => q.id === id ? { ...q, status } : q),
    );
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/quotes/${id}`));
    this._quotes.update(list => list.filter(q => q.id !== id));
  }

  total(quote: Quote): number {
    return quote.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

  nextNumber(): number {
    const nums = this._quotes().map(q => q.number);
    return nums.length > 0 ? Math.max(...nums) + 1 : 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Quote {
    return {
      id:          dto.id,
      workspaceId: dto.workspaceId,
      clientId:    dto.clientId   ?? '',
      clientName:  dto.clientName ?? '',
      items:       (dto.items ?? []).map((i: any) => ({
        id:          i.id,
        quoteId:     i.quoteId,
        description: i.description ?? '',
        quantity:    i.quantity    ?? 0,
        unitPrice:   i.unitPrice   ?? 0,
        currency:    i.currency    ?? 'EUR',
      })),
      number:    dto.number   ?? 0,
      status:    (dto.status  ?? 'DRAFT') as QuoteStatus,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      notes:     dto.notes    ?? '',
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

}
