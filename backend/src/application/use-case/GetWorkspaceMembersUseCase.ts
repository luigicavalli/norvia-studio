import { AppErrors }                  from "../error/AppError.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetWorkspaceMembersInput {
    workspaceId:     string;
    requestingUserId: string;
}

export class GetWorkspaceMembersUseCase implements IUseCase<GetWorkspaceMembersInput, TeamMember[]> {

    public constructor(private readonly teamMemberRepository: TeamMemberRepository) {}

    public async execute(input: GetWorkspaceMembersInput): Promise<TeamMember[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.requestingUserId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.teamMemberRepository.findByWorkspace(input.workspaceId);

    }

}
