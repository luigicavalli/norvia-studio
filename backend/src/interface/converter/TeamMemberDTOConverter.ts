import { TeamMember }              from "../../domain/model/TeamMember.js";
import { Workspace }               from "../../domain/model/Workspace.js";
import type { TeamMemberDTO }      from "../dto/TeamMemberDTO.js";
import type { TeamMemberRoles }    from "../../domain/enums/TeamMemberRoles.js";
import type { TeamMemberStatuses } from "../../domain/enums/TeamMemberStatuses.js";
import type { IDTOConverter }      from "./IDTOConverter.js";


export class TeamMemberDTOConverter implements IDTOConverter<TeamMemberDTO, TeamMember> {

    public toBO(dto: TeamMemberDTO): TeamMember {

        const workspace = new Workspace();
        workspace.id = dto.workspaceId;

        const member = new TeamMember();
        member.id        = dto.id;
        member.workspace = workspace;
        member.userId    = dto.userId    ?? null;
        member.email     = dto.email     ?? null;
        member.firstName = dto.firstName ?? null;
        member.lastName  = dto.lastName  ?? null;
        member.role      = dto.role as TeamMemberRoles;
        member.status    = dto.status as TeamMemberStatuses;
        member.createdAt = dto.createdAt;
        member.updatedAt = dto.updatedAt;

        return member;

    }

    public toDTO(bo: TeamMember): TeamMemberDTO {

        return {
            id:          bo.id,
            workspaceId: bo.workspace?.id,
            userId:      bo.userId    ?? null,
            email:       bo.email     ?? null,
            firstName:   bo.firstName ?? null,
            lastName:    bo.lastName  ?? null,
            role:        bo.role,
            status:      bo.status,
            createdAt:   bo.createdAt,
            updatedAt:   bo.updatedAt,
        };

    }

}
