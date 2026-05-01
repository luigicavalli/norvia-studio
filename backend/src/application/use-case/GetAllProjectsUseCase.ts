import { AppErrors }                  from "../error/AppError.js";
import type { Project }               from "../../domain/model/Project.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { ProjectRepository }     from "../../domain/repositories/ProjectRepository.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetAllProjectsInput {
    workspaceId: string;
    userId:      string;
    limit?:      number | undefined;
    offset?:     number | undefined;
}

export class GetAllProjectsUseCase implements IUseCase<GetAllProjectsInput, Project[]> {

    public constructor(
        private readonly projectRepository:    ProjectRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: GetAllProjectsInput): Promise<Project[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.projectRepository.findByWorkspace(input.workspaceId, input.limit, input.offset);

    }

}
