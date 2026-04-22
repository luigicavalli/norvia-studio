import { Injectable, signal, computed } from '@angular/core';


export interface Client {
  id:            string;
  name:          string;
  contactName:   string;
  email:         string;
  phone:         string;
  website:       string;
  notes:         string;
  projectsCount: number;
  createdAt:     Date;
}

export interface CreateClientData {
  name:        string;
  contactName: string;
  email:       string;
  phone:       string;
  website:     string;
  notes:       string;
}


@Injectable({ providedIn: 'root' })
export class ClientService {

  private readonly _clients = signal<Client[]>([]);

  readonly clients = this._clients.asReadonly();
  readonly total   = computed(() => this._clients().length);

  create(data: CreateClientData): void {
    const client: Client = {
      id:            crypto.randomUUID(),
      projectsCount: 0,
      createdAt:     new Date(),
      ...data,
    };
    this._clients.update(list => [client, ...list]);
  }

  update(id: string, data: Partial<CreateClientData>): void {
    this._clients.update(list =>
      list.map(c => c.id === id ? { ...c, ...data } : c),
    );
  }

  remove(id: string): void {
    this._clients.update(list => list.filter(c => c.id !== id));
  }

}
