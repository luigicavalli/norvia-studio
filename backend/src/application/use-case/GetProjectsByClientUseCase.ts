import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


interface GetProjectsByClientInput {
    clientId: string;
    limit?:   number;
    offset?:  number;
}

export class GetProjectsByClientUseCase implements IUseCase<GetProjectsByClientInput, Project[]> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: GetProjectsByClientInput): Promise<Project[]> {

        const clientId: string = input.clientId;

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;
        
        const projects: Project[] = await this.projectRepository.findByClient(clientId, limit, offset);

        return projects;

    }

}