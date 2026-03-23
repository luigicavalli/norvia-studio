import type { ProjectPO }       from "../po/ProjectPO.js";
import type { IGenericDAO }     from "./IGenericDAO.js";
import type { ProjectPOFlat }   from "../po/ProjectPOFlat.js";
import type { ProjectStatuses } from "../../../domain/enums/ProjectStatuses.js";

export interface ProjectDAO extends IGenericDAO<string, ProjectPO | ProjectPOFlat> {

    findAll(limit?: number, offset?: number): Promise<ProjectPOFlat[]>;

    findById(id: string): Promise<ProjectPOFlat>;

    findByClient(clientId: string, limit?: number, offset?: number): Promise<ProjectPOFlat[]>;

    save(entity: ProjectPO): Promise<ProjectPO>;
    
    updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO>;

    findByNameAndClient(projectName: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPOFlat[]>;

    delete(entity: ProjectPO): Promise<boolean>;

};