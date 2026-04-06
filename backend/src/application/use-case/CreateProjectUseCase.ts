import { AppErrors }              from "../error/AppError.js";
import type { Project }           from "../../domain/model/Project.js";
import type { IUseCase }          from "./IUseCase.js";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository.js";


export class CreateProjectUseCase implements IUseCase<Project, Project> {

    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async execute(input: Project): Promise<Project> {

        const projectName: string = input.name;
        const clientId:    string = input.client.id;

        const existingProject = await this.projectRepository.findByNameAndClient(input.workspace.id, projectName, clientId);

        if (existingProject) {
            throw AppErrors.conflict('Project already exists for this client', 'PROJECT_ALREADY_EXISTS');
        }
        
        const createdProject: Project = await this.projectRepository.save(input);

        return createdProject;

    }

}