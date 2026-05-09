import type { Assignment }  from "../model/Assignment.js";
import type { IRepository } from "./IRepository.js";


export interface AssignmentRepository extends IRepository<string, Assignment> {

    findByProject(projectId: string): Promise<Assignment[]>;

    findByTeamMember(teamMemberId: string): Promise<Assignment[]>;

};
