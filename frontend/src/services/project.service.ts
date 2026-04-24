import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }               from '../environments/environment';
import { WorkspaceService }          from './workspace.service';
import type { ApiPaginatedResponse } from '../types/api.types';
import type { Project, ProjectStatus, ProjectPriority, SaveProjectData } from '../models/project.model';

export type { Project, ProjectStatus, ProjectPriority, SaveProjectData };


@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _projects = signal<Project[]>([]);
  private readonly _loading  = signal(false);

  readonly projects = this._projects.asReadonly();
  readonly loading  = this._loading.asReadonly();

  readonly activeCount    = computed(() => this._projects().filter(p => p.status === 'ACTIVE').length);
  readonly onHoldCount    = computed(() => this._projects().filter(p => p.status === 'ON_HOLD').length);
  readonly completedCount = computed(() => this._projects().filter(p => p.status === 'COMPLETED').length);

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiPaginatedResponse<any>>(`${environment.apiUrl}/api/projects`, { params }),
      );
      this._projects.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: SaveProjectData): Promise<void> {
    const body = this.buildBody(crypto.randomUUID(), data, null, new Date());
    await firstValueFrom(this.http.post(`${environment.apiUrl}/api/projects`, body));
    await this.load();
  }

  async update(id: string, data: SaveProjectData, existing: Project): Promise<void> {
    const completedAt = data.status === 'COMPLETED'
      ? (existing.completedAt ?? new Date())
      : null;
    const body = this.buildBody(id, data, completedAt, existing.createdAt);
    await firstValueFrom(this.http.put(`${environment.apiUrl}/api/projects/${id}`, body));
    await this.load();
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/api/projects/${id}`));
    this._projects.update(list => list.filter(p => p.id !== id));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildBody(id: string, data: SaveProjectData, completedAt: Date | null, createdAt: Date): any {
    const workspaceId = this.workspace.activeId()!;
    const now = new Date().toISOString();

    return {
      id,
      workspaceId,
      name:           data.name,
      description:    data.description,
      client: {
        id:          data.client.id,
        workspaceId,
        firstName:   data.client.firstName,
        lastName:    data.client.lastName,
        email:       data.client.email,
        phone:       Number(data.client.phone.replace(/\D/g, '')) || 0,
        company:     { id: data.client.companyId ?? '', name: data.client.companyName ?? '', taxCode: '', email: '', phone: 0, address: '', city: '', zipCode: 0, country: '', website: '', createdAt: now, updatedAt: now },
        vatNumber:   data.client.vatNumber,
        status:      data.client.status,
        notes:       data.client.notes,
        createdAt:   now,
        updatedAt:   now,
      },
      status:         data.status,
      priority:       data.priority,
      budgetAmount:   data.budgetAmount ?? 0,
      budgetCurrency: data.budgetCurrency,
      startDate:      data.startDate?.toISOString() ?? now,
      dueDate:        data.dueDate?.toISOString()   ?? now,
      completedAt:    completedAt?.toISOString()    ?? null,
      createdAt:      createdAt.toISOString(),
      updatedAt:      now,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Project {
    const clientName = dto.client
      ? [dto.client.firstName, dto.client.lastName].filter(Boolean).join(' ')
      : '';
    return {
      id:             dto.id,
      name:           dto.name            ?? '',
      description:    dto.description     ?? '',
      clientId:       dto.client?.id      ?? '',
      clientName,
      status:         (dto.status         ?? 'UNKNOWN') as ProjectStatus,
      priority:       (dto.priority       ?? 'UNKNOWN') as ProjectPriority,
      budgetAmount:   dto.budgetAmount    ?? null,
      budgetCurrency: dto.budgetCurrency  ?? 'EUR',
      startDate:      dto.startDate   ? new Date(dto.startDate)   : null,
      dueDate:        dto.dueDate     ? new Date(dto.dueDate)     : null,
      completedAt:    dto.completedAt ? new Date(dto.completedAt) : null,
      createdAt:      new Date(dto.createdAt),
      updatedAt:      new Date(dto.updatedAt),
    };
  }

}
