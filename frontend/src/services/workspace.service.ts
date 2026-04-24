import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment }    from '../environments/environment';
import type { ApiResponse } from '../types/api.types';
import type { Workspace }   from '../models/workspace.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {

  private readonly http = inject(HttpClient);

  private readonly _workspaces = signal<Workspace[]>([]);
  private readonly _activeId   = signal<string | null>(null);
  private readonly _loading    = signal(false);
  private readonly _loaded     = signal(false);

  readonly workspaces      = this._workspaces.asReadonly();
  readonly activeId        = this._activeId.asReadonly();
  readonly activeWorkspace = computed(() =>
    this._workspaces().find(w => w.id === this._activeId()) ?? null,
  );
  readonly loading      = this._loading.asReadonly();
  readonly loaded       = this._loaded.asReadonly();
  readonly hasWorkspace = computed(() => this._loaded() && this._workspaces().length > 0);
  readonly needsSetup   = computed(() => this._loaded() && !this._loading() && this._workspaces().length === 0);

  setActive(id: string): void {
    this._activeId.set(id);
  }

  async load(): Promise<void> {
    this._loading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Workspace[]>>(`${environment.apiUrl}/api/workspaces`),
      );
      const list = res.data ?? [];
      this._workspaces.set(list);
      if (list.length && !this._activeId()) {
        this._activeId.set(list[0].id);
      }
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  async create(name: string, description?: string): Promise<void> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const now  = new Date().toISOString();
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/workspaces`, {
        id:          crypto.randomUUID(),
        name,
        slug,
        description: description ?? null,
        createdAt:   now,
        updatedAt:   now,
      }),
    );
    await this.load();
  }

  async update(id: string, name: string, description?: string): Promise<void> {
    const existing = this._workspaces().find(w => w.id === id)!;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const desc = description ?? existing.description;
    await firstValueFrom(
      this.http.put(`${environment.apiUrl}/api/workspaces/${id}`, {
        id,
        name,
        slug,
        description: desc || null,
        createdAt:   existing.createdAt,
        updatedAt:   new Date().toISOString(),
      }),
    );
    this._workspaces.update(list =>
      list.map(w => w.id === id ? { ...w, name, slug, description: desc || null } : w),
    );
  }

}
