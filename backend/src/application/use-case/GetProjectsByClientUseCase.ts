import { AppErrors }                  from "../error/AppError.js";
import type { Project }               from "../../domain/model/Project.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { ProjectRepository }     from "../../domain/repositories/ProjectRepository.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetProjectsByClientInput {
    workspaceId: string;
    clientId:    string;
    userId:      string;
    limit?:      number | undefined;
    offset?:     number | undefined;
}

export class GetProjectsByClientUseCase implements IUseCase<GetProjectsByClientInput, Project[]> {

    public constructor(
        private readonly projectRepository:    ProjectRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: GetProjectsByClientInput): Promise<Project[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.projectRepository.findByClient(input.workspaceId, input.clientId, input.limit, input.offset);

    }

}
