import { randomUUID }                 from "crypto";
import { Workspace }                  from "../../domain/model/Workspace.js";
import { TeamMember }                 from "../../domain/model/TeamMember.js";
import { TeamMemberRoles }            from "../../domain/enums/TeamMemberRoles.js";
import { TeamMemberStatuses }         from "../../domain/enums/TeamMemberStatuses.js";
import { AppErrors }                  from "../error/AppError.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface InviteTeamMemberInput {
    workspaceId:      string;
    email:            string;
    role:             TeamMemberRoles;
    requestingUserId: string;
}

export class InviteTeamMemberUseCase implements IUseCase<InviteTeamMemberInput, TeamMember> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: InviteTeamMemberInput): Promise<TeamMember> {

        const requester: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.requestingUserId);

        if (!requester || (requester.role !== TeamMemberRoles.OWNER && requester.role !== TeamMemberRoles.ADMIN)) {
            throw AppErrors.forbidden('Insufficient permissions', 'FORBIDDEN');
        }

        const existing: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndEmail(input.workspaceId, input.email);

        if (existing) {
            throw AppErrors.conflict('User is already a member or has a pending invite', 'TEAM_MEMBER_ALREADY_EXISTS');
        }

        const workspace = new Workspace();
        workspace.id = input.workspaceId;

        const member = new TeamMember();
        member.id        = randomUUID();
        member.workspace = workspace;
        member.userId    = null;
        member.email     = input.email;
        member.role      = input.role;
        member.status    = TeamMemberStatuses.PENDING;
        member.createdAt = new Date();
        member.updatedAt = new Date();

        return this.teamMemberRepository.save(member);

    }

}
