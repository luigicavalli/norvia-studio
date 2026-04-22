import { Injectable, signal, computed } from '@angular/core';


export type ProjectStatus = 'active' | 'paused' | 'completed';

export interface Project {
  id:          string;
  name:        string;
  description: string;
  clientName:  string;
  status:      ProjectStatus;
  dueDate:     Date | null;
  tasksCount:  number;
  createdAt:   Date;
}

export interface CreateProjectData {
  name:        string;
  description: string;
  clientName:  string;
  status:      ProjectStatus;
  dueDate:     Date | null;
}


@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly _projects = signal<Project[]>([]);

  readonly projects = this._projects.asReadonly();

  readonly activeCount    = computed(() => this._projects().filter(p => p.status === 'active').length);
  readonly pausedCount    = computed(() => this._projects().filter(p => p.status === 'paused').length);
  readonly completedCount = computed(() => this._projects().filter(p => p.status === 'completed').length);

  create(data: CreateProjectData): void {
    const project: Project = {
      id:          crypto.randomUUID(),
      tasksCount:  0,
      createdAt:   new Date(),
      ...data,
    };
    this._projects.update(list => [project, ...list]);
  }

  update(id: string, data: Partial<CreateProjectData>): void {
    this._projects.update(list =>
      list.map(p => p.id === id ? { ...p, ...data } : p),
    );
  }

  remove(id: string): void {
    this._projects.update(list => list.filter(p => p.id !== id));
  }

}
