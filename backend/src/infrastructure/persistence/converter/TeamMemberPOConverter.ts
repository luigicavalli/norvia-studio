import { TeamMember }                 from "../../../domain/model/TeamMember.js";
import { TeamMemberPO }               from "../po/TeamMemberPO.js";
import { Workspace }                  from "../../../domain/model/Workspace.js";
import type { TeamMemberRoles }       from "../../../domain/enums/TeamMemberRoles.js";
import type { TeamMemberStatuses }    from "../../../domain/enums/TeamMemberStatuses.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class TeamMemberPOConverter implements IPersistenceConverter<TeamMemberPO, TeamMember> {

    public toBO(po: TeamMemberPO): TeamMember {

        const teamMemberBo: TeamMember = new TeamMember();

            teamMemberBo.id           = po.id;

            teamMemberBo.workspace    = new Workspace();
            teamMemberBo.workspace.id = po.workspace_id;

            teamMemberBo.userId       = po.user_id    ?? null;
            teamMemberBo.email        = po.email      ?? null;
            teamMemberBo.firstName    = po.first_name ?? null;
            teamMemberBo.lastName     = po.last_name  ?? null;
            teamMemberBo.role         = po.role as TeamMemberRoles;
            teamMemberBo.status       = po.status as TeamMemberStatuses;
            teamMemberBo.createdAt    = po.created_at;
            teamMemberBo.updatedAt    = po.updated_at;

        return teamMemberBo;

    };

    public toPO(bo: TeamMember): TeamMemberPO {

        const teamMemberPo: TeamMemberPO = new TeamMemberPO();

            teamMemberPo.id           = bo.id;
            teamMemberPo.workspace_id = bo.workspace.id;
            teamMemberPo.user_id      = bo.userId;
            teamMemberPo.email        = bo.email;
            teamMemberPo.first_name   = bo.firstName;
            teamMemberPo.last_name    = bo.lastName;
            teamMemberPo.role         = bo.role;
            teamMemberPo.status       = bo.status;
            teamMemberPo.created_at   = bo.createdAt;
            teamMemberPo.updated_at   = bo.updatedAt;

        return teamMemberPo;

    };

};
