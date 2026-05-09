import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }      from '../environments/environment';
import { WorkspaceService } from './workspace.service';
import type { ApiPaginatedResponse } from '../types/api.types';
import type { Company, CreateCompanyData } from '../models/company.model';
import type { SelectOption } from '../feature/components/shared/select/select.types';

export type { Company, CreateCompanyData };


@Injectable({ providedIn: 'root' })
export class CompanyService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _companies = signal<Company[]>([]);
  private readonly _loading   = signal(false);
  private readonly _loaded    = signal(false);

  readonly companies = this._companies.asReadonly();
  readonly total     = computed(() => this._companies().length);
  readonly loading   = this._loading.asReadonly();
  readonly loaded    = this._loaded.asReadonly();

  readonly asOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Nessuna azienda' },
    ...this._companies().map(c => ({ value: c.id, label: c.name })),
  ]);

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiPaginatedResponse<any>>(`${environment.apiUrl}/api/companies`, { params }),
      );
      this._companies.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  async create(data: CreateCompanyData): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();
    const body = {
      id:          crypto.randomUUID(),
      workspaceId,
      name:        data.name,
      taxCode:     data.taxCode,
      email:       data.email,
      phone:       Number(data.phone.replace(/\D/g, '')) || 0,
      address:     data.address,
      city:        data.city,
      zipCode:     Number(data.zipCode) || 0,
      country:     data.country,
      website:     data.website,
      createdAt:   now,
      updatedAt:   now,
    };
    await firstValueFrom(this.http.post(`${environment.apiUrl}/api/companies`, body));
    await this.load();
  }

  async update(id: string, data: CreateCompanyData, existing: Company): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();
    const body = {
      id,
      workspaceId,
      name:        data.name,
      taxCode:     data.taxCode,
      email:       data.email,
      phone:       Number(data.phone.replace(/\D/g, '')) || 0,
      address:     data.address,
      city:        data.city,
      zipCode:     Number(data.zipCode) || 0,
      country:     data.country,
      website:     data.website,
      createdAt:   existing.createdAt.toISOString(),
      updatedAt:   now,
    };
    await firstValueFrom(this.http.put(`${environment.apiUrl}/api/companies/${id}`, body));
    await this.load();
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/companies/${id}`));
    this._companies.update(list => list.filter(c => c.id !== id));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Company {
    return {
      id:        dto.id,
      name:      dto.name      ?? '',
      taxCode:   dto.taxCode   ?? '',
      email:     dto.email     ?? '',
      phone:     String(dto.phone ?? ''),
      address:   dto.address   ?? '',
      city:      dto.city      ?? '',
      zipCode:   String(dto.zipCode ?? ''),
      country:   dto.country   ?? '',
      website:   dto.website   ?? '',
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

}
