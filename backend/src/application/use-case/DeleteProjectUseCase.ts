import { AppErrors }              from "../error/AppError.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


export class DeleteProjectUseCase implements IUseCase<string, boolean> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: string): Promise<boolean> {
        
        const success: boolean = await this.projectRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Cannot update Project', 'CANNOT_UPDATE_PROJECT');
        }

        return success;

    }

}