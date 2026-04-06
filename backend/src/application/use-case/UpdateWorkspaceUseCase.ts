import { AppErrors }                  from "../error/AppError.js";
import { TeamMemberRoles }             from "../../domain/enums/TeamMemberRoles.js";
import type { Workspace }              from "../../domain/model/Workspace.js";
import type { TeamMember }             from "../../domain/model/TeamMember.js";
import type { IUseCase }               from "./IUseCase.js";
import type { WorkspaceRepository }    from "../../domain/repositories/WorkspaceRepository.js";
import type { TeamMemberRepository }   from "../../domain/repositories/TeamMemberRepository.js";


type UpdateWorkspaceInput = { workspace: Workspace; userId: string };

export class UpdateWorkspaceUseCase implements IUseCase<UpdateWorkspaceInput, Workspace> {

    public constructor(
        private readonly workspaceRepository:  WorkspaceRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: UpdateWorkspaceInput): Promise<Workspace> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspace.id, input.userId);

        if (!member || (member.role !== TeamMemberRoles.OWNER && member.role !== TeamMemberRoles.ADMIN)) {
            throw AppErrors.forbidden('Insufficient permissions', 'FORBIDDEN');
        }

        const existing: Workspace | null = await this.workspaceRepository.findBySlug(input.workspace.slug);

        if (existing && existing.id !== input.workspace.id) {
            throw AppErrors.conflict('Slug already in use', 'WORKSPACE_SLUG_CONFLICT');
        }

        return this.workspaceRepository.save(input.workspace);

    }

}
