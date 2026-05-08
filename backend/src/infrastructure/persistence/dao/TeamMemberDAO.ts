import type { IGenericDAO }  from "./IGenericDAO.js";
import type { TeamMemberPO } from "../po/TeamMemberPO.js";


export interface TeamMemberDAO extends IGenericDAO<string, TeamMemberPO> {

    findByWorkspace(workspaceId: string): Promise<TeamMemberPO[]>;

    findById(id: string): Promise<TeamMemberPO | null>;

    findByUserId(workspaceId: string, userId: string): Promise<TeamMemberPO | null>;

    findByEmail(workspaceId: string, email: string): Promise<TeamMemberPO | null>;

    findAllByEmail(email: string): Promise<TeamMemberPO[]>;

    findByIds(ids: string[]): Promise<TeamMemberPO[]>;

    save(entity: TeamMemberPO): Promise<TeamMemberPO>;

    delete(entity: TeamMemberPO): Promise<boolean>;

};
