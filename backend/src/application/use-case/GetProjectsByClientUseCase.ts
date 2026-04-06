import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


interface GetProjectsByClientInput {
    workspaceId: string;
    clientId:    string;
    limit?:      number | undefined;
    offset?:     number | undefined;
}

export class GetProjectsByClientUseCase implements IUseCase<GetProjectsByClientInput, Project[]> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: GetProjectsByClientInput): Promise<Project[]> {

        const workspaceId: string = input.workspaceId;
        const clientId:    string = input.clientId;

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;

        const projects: Project[] = await this.projectRepository.findByClient(workspaceId, clientId, limit, offset);

        return projects;

    }

}