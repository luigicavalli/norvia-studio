import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


export class GetProjectByIdUseCase implements IUseCase<string, Project> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: string): Promise<Project> {
        
        const project: Project | null = await this.projectRepository.findById(input);

        if (!project) {
            throw new Error()
        }

        return project;

    }

}