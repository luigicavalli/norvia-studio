import { AppErrors }              from "../error/AppError.js";
import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


export class DeleteProjectUseCase implements IUseCase<Project, boolean> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: Project): Promise<boolean> {
        
        const success: boolean = await this.projectRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Cannot update Project', 'CANNOT_UPDATE_PROJECT');
        }

        return success;

    }

}