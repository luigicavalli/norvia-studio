import type { Project }         from "../model/Project.js";
import type { IRepository }     from "./IRepository.js";
import type { ProjectStatuses } from "../enums/ProjectStatuses.js";

export interface ProjectRepository extends IRepository<string, Project> {

    findAll(limit?: number, offset?: number): Promise<Project[]>;

    findByClient(clientId: string, limit?: number, offset?: number): Promise<Project[]>;

    updateStatus(projectId: string, status: ProjectStatuses): Promise<Project>;

    findByNameAndClient(projectName: string, clientId: string): Promise<Project | null>;

}