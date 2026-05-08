import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }      from '../environments/environment';
import { WorkspaceService } from './workspace.service';
import type { ApiResponse } from '../types/api.types';
import type { TeamMember, MemberRole, MemberStatus, InviteMemberData } from '../models/team.model';

export type { TeamMember, MemberRole, MemberStatus, InviteMemberData };


@Injectable({ providedIn: 'root' })
export class TeamService {

  private readonly http      = inject(HttpClient);
  private readonly workspace = inject(WorkspaceService);

  private readonly _members = signal<TeamMember[]>([]);
  private readonly _loading = signal(false);
  private readonly _loaded  = signal(false);

  readonly members = this._members.asReadonly();
  readonly active  = computed(() => this._members().filter(m => m.status === 'active'));
  readonly pending = computed(() => this._members().filter(m => m.status === 'pending'));
  readonly loading = this._loading.asReadonly();
  readonly loaded  = this._loaded.asReadonly();

  async load(): Promise<void> {
    const workspaceId = this.workspace.activeId();
    if (!workspaceId) return;

    this._loading.set(true);
    try {
      const res = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/workspaces/${workspaceId}/members`),
      );
      this._members.set((res.data ?? []).map(dto => this.mapDto(dto)));
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  async invite(data: InviteMemberData): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/workspaces/${workspaceId}/members/invite`, {
        email: data.email,
        role:  data.role.toUpperCase(),
      }),
    );
    await this.load();
  }

  async activateSelf(): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/members/activate-self`, {}),
    );
  }

  async remove(id: string): Promise<void> {
    const workspaceId = this.workspace.activeId()!;
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/workspaces/${workspaceId}/members/${id}`),
    );
    this._members.update(list => list.filter(m => m.id !== id));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDto(dto: any): TeamMember {
    return {
      id:        dto.id,
      firstName: dto.firstName  ?? '',
      lastName:  dto.lastName   ?? '',
      email:     dto.email      ?? '',
      role:      (dto.role?.toLowerCase()   ?? 'member') as MemberRole,
      status:    (dto.status?.toLowerCase() ?? 'active') as MemberStatus,
      avatarUrl: dto.avatarUrl  ?? null,
      joinedAt:  new Date(dto.createdAt),
    };
  }

}
