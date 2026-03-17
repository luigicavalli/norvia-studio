import type { ProjectPO }       from "../po/ProjectPO.js";
import type { IGenericDAO }     from "./IGenericDAO.js";
import type { ProjectStatuses } from "../../../domain/enums/ProjectStatuses.js";

export interface ProjectDAO extends IGenericDAO<string, ProjectPO> {

    findByClient(clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]>;
    
    updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO>;

    findByNameAndClient(projectName: string, clientId: string): Promise<ProjectPO | null>;

};