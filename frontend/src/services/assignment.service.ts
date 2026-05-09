import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }      from '../environments/environment';
import type { ApiResponse } from '../types/api.types';
import type { Assignment }  from '../models/assignment.model';

export type { Assignment };


@Injectable({ providedIn: 'root' })
export class AssignmentService {

  private readonly http = inject(HttpClient);

  private readonly _assignments = signal<Assignment[]>([]);
  private readonly _loading     = signal(false);

  readonly assignments = this._assignments.asReadonly();
  readonly loading     = this._loading.asReadonly();

  readonly byProject = computed(() => {
    const map = new Map<string, Assignment[]>();
    for (const a of this._assignments()) {
      const list = map.get(a.projectId) ?? [];
      list.push(a);
      map.set(a.projectId, list);
    }
    return map;
  });

  async load(workspaceId: string): Promise<void> {
    this._loading.set(true);
    try {
      const params = new HttpParams().set('workspaceId', workspaceId);
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/assignments`, { params }),
      );
      this._assignments.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
    }
  }

  async getByProject(projectId: string, workspaceId: string): Promise<Assignment[]> {
    const params = new HttpParams().set('workspaceId', workspaceId);
    const res = await firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/projects/${projectId}/assignments`, { params }),
    );
    return (res.data ?? []).map(dto => this.mapDto(dto));
  }

  async create(projectId: string, teamMemberId: string, workspaceId: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/projects/${projectId}/assignments`, {
        teamMemberId,
        workspaceId,
      }),
    );
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/assignments/${id}`),
    );
  }

  updateLocalCache(projectId: string, assignments: Assignment[]): void {
    this._assignments.update(all => [
      ...all.filter(a => a.projectId !== projectId),
      ...assignments,
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): Assignment {
    return {
      id:           dto.id,
      projectId:    dto.projectId,
      teamMemberId: dto.teamMemberId,
      teamMember:   dto.teamMember ? {
        id:        dto.teamMember.id,
        userId:    dto.teamMember.userId    ?? '',
        firstName: dto.teamMember.firstName ?? '',
        lastName:  dto.teamMember.lastName  ?? '',
        email:     dto.teamMember.email     ?? '',
        role:      (dto.teamMember.role?.toLowerCase()   ?? 'member'),
        status:    (dto.teamMember.status?.toLowerCase() ?? 'active'),
        avatarUrl: dto.teamMember.avatarUrl ?? null,
        joinedAt:  new Date(dto.teamMember.createdAt),
      } : null,
      createdAt: new Date(dto.createdAt),
    };
  }

}
