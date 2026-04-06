import type { ProjectPO }       from "../po/ProjectPO.js";
import type { IGenericDAO }     from "./IGenericDAO.js";
import type { ProjectStatuses } from "../../../domain/enums/ProjectStatuses.js";


export interface ProjectDAO extends IGenericDAO<string, ProjectPO> {

    findAll(limit?: number, offset?: number): Promise<ProjectPO[]>;

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ProjectPO[]>;

    findById(id: string): Promise<ProjectPO | null>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]>;

    findByNameAndClient(workspaceId: string, projectName: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]>;

    save(entity: ProjectPO): Promise<ProjectPO>;

    updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO>;

    delete(entity: ProjectPO): Promise<boolean>;

};