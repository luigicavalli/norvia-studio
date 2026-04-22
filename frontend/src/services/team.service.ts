import { Injectable, signal, computed } from '@angular/core';


export type MemberRole   = 'admin' | 'member' | 'viewer';
export type MemberStatus = 'active' | 'pending';

export interface TeamMember {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  role:      MemberRole;
  status:    MemberStatus;
  avatarUrl: string | null;
  joinedAt:  Date;
}

export interface InviteMemberData {
  email: string;
  role:  MemberRole;
}


@Injectable({ providedIn: 'root' })
export class TeamService {

  private readonly _members = signal<TeamMember[]>([]);

  readonly members = this._members.asReadonly();
  readonly active  = computed(() => this._members().filter(m => m.status === 'active'));
  readonly pending = computed(() => this._members().filter(m => m.status === 'pending'));

  invite(data: InviteMemberData): void {
    const member: TeamMember = {
      id:        crypto.randomUUID(),
      firstName: '',
      lastName:  '',
      avatarUrl: null,
      status:    'pending',
      joinedAt:  new Date(),
      ...data,
    };
    this._members.update(list => [...list, member]);
  }

  updateRole(id: string, role: MemberRole): void {
    this._members.update(list =>
      list.map(m => m.id === id ? { ...m, role } : m),
    );
  }

  remove(id: string): void {
    this._members.update(list => list.filter(m => m.id !== id));
  }

}
