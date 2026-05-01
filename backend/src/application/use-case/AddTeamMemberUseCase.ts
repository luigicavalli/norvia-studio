import { randomUUID }                 from "crypto";
import { Workspace }                  from "../../domain/model/Workspace.js";
import { TeamMember }                 from "../../domain/model/TeamMember.js";
import { TeamMemberRoles }            from "../../domain/enums/TeamMemberRoles.js";
import { AppErrors }                  from "../error/AppError.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface AddTeamMemberInput {
    workspaceId:      string;
    newUserId:        string;
    role:             TeamMemberRoles;
    requestingUserId: string;
}

export class AddTeamMemberUseCase implements IUseCase<AddTeamMemberInput, TeamMember> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: AddTeamMemberInput): Promise<TeamMember> {

        const requester: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.requestingUserId);

        if (!requester || (requester.role !== TeamMemberRoles.OWNER && requester.role !== TeamMemberRoles.ADMIN)) {
            throw AppErrors.forbidden('Insufficient permissions', 'FORBIDDEN');
        }

        const existing: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.newUserId);

        if (existing) {
            throw AppErrors.conflict('User is already a member of this workspace', 'TEAM_MEMBER_ALREADY_EXISTS');
        }

        const workspace = new Workspace();
        workspace.id = input.workspaceId;

        const member = new TeamMember();
        member.id        = randomUUID();
        member.workspace = workspace;
        member.userId    = input.newUserId;
        member.role      = input.role;
        member.createdAt = new Date();
        member.updatedAt = new Date();

        return this.teamMemberRepository.save(member);

    }

}
