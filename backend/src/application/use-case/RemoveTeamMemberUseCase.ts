import { TeamMemberRoles }            from "../../domain/enums/TeamMemberRoles.js";
import { AppErrors }                  from "../error/AppError.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface RemoveTeamMemberInput {
    memberId:         string;
    workspaceId:      string;
    requestingUserId: string;
}

export class RemoveTeamMemberUseCase implements IUseCase<RemoveTeamMemberInput, boolean> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: RemoveTeamMemberInput): Promise<boolean> {

        const requester: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.requestingUserId);

        if (!requester || (requester.role !== TeamMemberRoles.OWNER && requester.role !== TeamMemberRoles.ADMIN)) {
            throw AppErrors.forbidden('Insufficient permissions', 'FORBIDDEN');
        }

        const target: TeamMember | null = await this.teamMemberRepository.findById(input.memberId);

        if (!target) {
            throw AppErrors.notFound('Team member not found', 'TEAM_MEMBER_NOT_FOUND');
        }

        if (target.role === TeamMemberRoles.OWNER) {
            throw AppErrors.forbidden('Cannot remove the workspace owner', 'FORBIDDEN');
        }

        return this.teamMemberRepository.delete(target);

    }

}
