import { TeamMember }              from "../../domain/model/TeamMember.js";
import { Workspace }               from "../../domain/model/Workspace.js";
import type { TeamMemberDTO }      from "../dto/TeamMemberDTO.js";
import type { TeamMemberRoles }    from "../../domain/enums/TeamMemberRoles.js";
import type { IDTOConverter }      from "./IDTOConverter.js";


export class TeamMemberDTOConverter implements IDTOConverter<TeamMemberDTO, TeamMember> {

    public toBO(dto: TeamMemberDTO): TeamMember {

        const workspace = new Workspace();
        workspace.id = dto.workspaceId;

        const member = new TeamMember();
        member.id        = dto.id;
        member.workspace = workspace;
        member.userId    = dto.userId;
        member.role      = dto.role as TeamMemberRoles;
        member.createdAt = dto.createdAt;
        member.updatedAt = dto.updatedAt;

        return member;

    }

    public toDTO(bo: TeamMember): TeamMemberDTO {

        return {
            id:          bo.id,
            workspaceId: bo.workspace?.id,
            userId:      bo.userId,
            role:        bo.role,
            createdAt:   bo.createdAt,
            updatedAt:   bo.updatedAt,
        };

    }

}
