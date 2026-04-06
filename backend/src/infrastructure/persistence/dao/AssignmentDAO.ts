import type { IGenericDAO }  from "./IGenericDAO.js";
import type { AssignmentPO } from "../po/AssignmentPO.js";


export interface AssignmentDAO extends IGenericDAO<string, AssignmentPO> {

    findByProject(projectId: string): Promise<AssignmentPO[]>;

    findByProjects(projectIds: string[]): Promise<AssignmentPO[]>;

    findByTeamMember(teamMemberId: string): Promise<AssignmentPO[]>;

    findById(id: string): Promise<AssignmentPO | null>;

    save(entity: AssignmentPO): Promise<AssignmentPO>;

    delete(entity: AssignmentPO): Promise<boolean>;

};
