import type { TeamMemberDTO } from "./TeamMemberDTO.js";

export interface AssignmentDTO {

    id:           string;
    projectId:    string;
    teamMemberId: string;
    teamMember:   TeamMemberDTO | null;
    createdAt:    Date;

};
