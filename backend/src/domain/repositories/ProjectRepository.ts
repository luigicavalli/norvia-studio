import type { Project }         from "../model/Project.js";
import type { IRepository }     from "./IRepository.js";
import type { ProjectStatuses } from "../enums/ProjectStatuses.js";

export interface ProjectRepository extends IRepository<string, Project> {

    findAll(limit?: number, offset?: number): Promise<Project[]>;

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Project[]>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Project[]>;

    findByNameAndClient(workspaceId: string, projectName: string, clientId: string, limit?: number, offset?: number): Promise<Project[]>;

    updateStatus(projectId: string, status: ProjectStatuses): Promise<Project>;

}
