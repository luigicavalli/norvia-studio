import { TeamMemberRoles }            from "../../domain/enums/TeamMemberRoles.js";
import { AppErrors }                  from "../error/AppError.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface UpdateTeamMemberRoleInput {
    memberId:         string;
    workspaceId:      string;
    role:             TeamMemberRoles;
    requestingUserId: string;
}

export class UpdateTeamMemberRoleUseCase implements IUseCase<UpdateTeamMemberRoleInput, TeamMember> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: UpdateTeamMemberRoleInput): Promise<TeamMember> {

        const requester: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.requestingUserId);

        if (!requester || (requester.role !== TeamMemberRoles.OWNER && requester.role !== TeamMemberRoles.ADMIN)) {
            throw AppErrors.forbidden('Insufficient permissions', 'FORBIDDEN');
        }

        const target: TeamMember | null = await this.teamMemberRepository.findById(input.memberId);

        if (!target) {
            throw AppErrors.notFound('Team member not found', 'TEAM_MEMBER_NOT_FOUND');
        }

        target.role      = input.role;
        target.updatedAt = new Date();

        return this.teamMemberRepository.save(target);

    }

}
