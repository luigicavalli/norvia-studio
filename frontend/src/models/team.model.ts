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
