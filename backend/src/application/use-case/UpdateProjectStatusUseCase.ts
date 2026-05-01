import { AppErrors }              from "../error/AppError.js";
import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectStatuses }   from "../../domain/enums/ProjectStatuses.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


interface UpdateProjectStatusInput {
    projectId:     string;
    projectStatus: ProjectStatuses;
}

export class UpdateProjectStatusUseCase implements IUseCase<UpdateProjectStatusInput, Project> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: UpdateProjectStatusInput): Promise<Project> {

        const existingProject: Project | null = await this.projectRepository.findById(input.projectId);
                
        if (!existingProject) {
            throw AppErrors.notFound('Project not found', 'PROJECT_NOT_FOUND');
        }
        
        const project: Project = await this.projectRepository.updateStatus(input.projectId, input.projectStatus);

        return project;

    }

}