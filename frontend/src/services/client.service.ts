import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }                    from '../environments/environment';
import { WorkspaceService }               from './workspace.service';
import type { ApiPaginatedResponse }      from '../types/api.types';


export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'UNKNOWN';

export interface Client {
  id:          string;
  firstName:   string;
  lastName:    string;
  fullName:    string;
  email:       string;
  phone:       string;
  companyId:   string | null;
  companyName: string | null;
  vatNumber:   string;
  status:      ClientStatus;
  notes:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface CreateClientData {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  notes:     string;
}


@Injectable({ providedIn: 'root' })
export class ClientService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _clients = signal<Client[]>([]);
  private readonly _loading = signal(false);

  readonly clients = this._clients.asReadonly();
  readonly total   = computed(() => this._clients().length);
  readonly loading = this._loading.asReadonly();

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiPaginatedResponse<any>>(`${environment.apiUrl}/api/clients`, { params }),
      );
      this._clients.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: CreateClientData): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();

    const body = {
      id:          crypto.randomUUID(),
      workspaceId,
      firstName:   data.firstName,
      lastName:    data.lastName,
      email:       data.email,
      phone:       Number(data.phone.replace(/\D/g, '')) || 0,
      company:     { id: '', name: '', taxCode: '', email: '', phone: 0, address: '', city: '', zipCode: 0, country: '', website: '', createdAt: now, updatedAt: now },
      vatNumber:   '',
      status:      'ACTIVE',
      notes:       data.notes,
      createdAt:   now,
      updatedAt:   now,
    };
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/clients`, body),
    );
    await this.load();
  }

  async update(id: string, data: CreateClientData, existing: Client): Promise<void> {
    const now = new Date().toISOString();
    const body = {
      id,
      workspaceId:  this.workspace.activeId()!,
      firstName:    data.firstName,
      lastName:     data.lastName,
      email:        data.email,
      phone:        Number(data.phone.replace(/\D/g, '')) || 0,
      company:      { id: existing.companyId ?? '', name: existing.companyName ?? '', taxCode: '', email: '', phone: 0, address: '', city: '', zipCode: 0, country: '', website: '', createdAt: now, updatedAt: now },
      vatNumber:    existing.vatNumber,
      status:       existing.status,
      notes:        data.notes,
      createdAt:    existing.createdAt.toISOString(),
      updatedAt:    now,
    };
    await firstValueFrom(this.http.put(`${environment.apiUrl}/api/clients/${id}`, body));
    await this.load();
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/clients/${id}`),
    );
    this._clients.update(list => list.filter(c => c.id !== id));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Client {
    return {
      id:          dto.id,
      firstName:   dto.firstName  ?? '',
      lastName:    dto.lastName   ?? '',
      fullName:    [dto.firstName, dto.lastName].filter(Boolean).join(' '),
      email:       dto.email      ?? '',
      phone:       String(dto.phone ?? ''),
      companyId:   dto.company?.id   || null,
      companyName: dto.company?.name || null,
      vatNumber:   dto.vatNumber  ?? '',
      status:      (dto.status    ?? 'UNKNOWN') as ClientStatus,
      notes:       dto.notes      ?? '',
      createdAt:   new Date(dto.createdAt),
      updatedAt:   new Date(dto.updatedAt),
    };
  }

}
