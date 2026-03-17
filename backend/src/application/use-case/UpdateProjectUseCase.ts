import { AppErrors }              from "../error/AppError.js";
import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


export class UpdateProjectUseCase implements IUseCase<Project, Project> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: Project): Promise<Project> {

        const existingProject: Project | null = await this.projectRepository.findById(input.id);
                        
        if (!existingProject) {
            throw AppErrors.notFound('Project not found', 'PROJECT_NOT_FOUND');
        }
        
        const project: Project = await this.projectRepository.save(input);

        return project;

    }

}