import { TeamMember }               from "../../../domain/model/TeamMember.js";
import { TeamMemberPO }             from "../po/TeamMemberPO.js";
import type { TeamMemberRoles }     from "../../../domain/enums/TeamMemberRoles.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class TeamMemberPOConverter implements IPersistenceConverter<TeamMemberPO, TeamMember> {

    public toBO(po: TeamMemberPO): TeamMember {

        const teamMemberBo: TeamMember = new TeamMember();

            teamMemberBo.id        = po.id;
            teamMemberBo.userId    = po.user_id;
            teamMemberBo.role      = po.role as TeamMemberRoles;
            teamMemberBo.createdAt = po.created_at;
            teamMemberBo.updatedAt = po.updated_at;

        return teamMemberBo;

    };

    public toPO(bo: TeamMember): TeamMemberPO {

        const teamMemberPo: TeamMemberPO = new TeamMemberPO();

            teamMemberPo.id           = bo.id;
            teamMemberPo.workspace_id = bo.workspace.id;
            teamMemberPo.user_id      = bo.userId;
            teamMemberPo.role         = bo.role;
            teamMemberPo.created_at   = bo.createdAt;
            teamMemberPo.updated_at   = bo.updatedAt;

        return teamMemberPo;

    };

};
