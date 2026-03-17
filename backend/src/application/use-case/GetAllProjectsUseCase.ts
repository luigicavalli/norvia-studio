import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


interface GetAllClientsInput {
    limit?:  number,
    offset?: number
}

export class GetAllProjectsUseCase implements IUseCase<GetAllClientsInput, Project[]> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: GetAllClientsInput): Promise<Project[]> {

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;
        
        const projects: Project[] = await this.projectRepository.findAll(limit, offset);

        return projects;

    }

}