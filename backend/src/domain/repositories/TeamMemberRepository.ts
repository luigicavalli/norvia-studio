import type { TeamMember } from "../model/TeamMember.js";

export interface TeamMemberRepository {

    findByWorkspace(workspaceId: string): Promise<TeamMember[]>;

    findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<TeamMember | null>;

    findByWorkspaceAndEmail(workspaceId: string, email: string): Promise<TeamMember | null>;

    findAllByEmail(email: string): Promise<TeamMember[]>;

    findById(id: string): Promise<TeamMember | null>;

    save(entity: TeamMember): Promise<TeamMember>;

    delete(entity: TeamMember): Promise<boolean>;

};
