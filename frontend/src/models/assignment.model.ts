import type { TeamMember } from './team.model';

export interface Assignment {
  id:           string;
  projectId:    string;
  teamMemberId: string;
  teamMember:   TeamMember | null;
  createdAt:    Date;
}
