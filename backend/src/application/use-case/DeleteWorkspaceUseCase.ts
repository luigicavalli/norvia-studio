import { AppErrors }                  from "../error/AppError.js";
import { TeamMemberRoles }             from "../../domain/enums/TeamMemberRoles.js";
import type { Workspace }              from "../../domain/model/Workspace.js";
import type { TeamMember }             from "../../domain/model/TeamMember.js";
import type { IUseCase }               from "./IUseCase.js";
import type { WorkspaceRepository }    from "../../domain/repositories/WorkspaceRepository.js";
import type { TeamMemberRepository }   from "../../domain/repositories/TeamMemberRepository.js";


type DeleteWorkspaceInput = { workspace: Workspace; userId: string };

export class DeleteWorkspaceUseCase implements IUseCase<DeleteWorkspaceInput, boolean> {

    public constructor(
        private readonly workspaceRepository:  WorkspaceRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: DeleteWorkspaceInput): Promise<boolean> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspace.id, input.userId);

        if (!member || member.role !== TeamMemberRoles.OWNER) {
            throw AppErrors.forbidden('Only the workspace owner can delete it', 'FORBIDDEN');
        }

        return this.workspaceRepository.delete(input.workspace);

    }

}
