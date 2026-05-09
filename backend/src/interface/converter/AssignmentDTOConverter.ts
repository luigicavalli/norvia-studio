import { Project }             from "../../domain/model/Project.js";
import { TeamMember }          from "../../domain/model/TeamMember.js";
import { Assignment }          from "../../domain/model/Assignment.js";
import { Workspace }           from "../../domain/model/Workspace.js";
import type { AssignmentDTO }  from "../dto/AssignmentDTO.js";
import type { TeamMemberDTO }  from "../dto/TeamMemberDTO.js";
import type { IDTOConverter }  from "./IDTOConverter.js";
import type { TeamMemberRoles }    from "../../domain/enums/TeamMemberRoles.js";
import type { TeamMemberStatuses } from "../../domain/enums/TeamMemberStatuses.js";


export class AssignmentDTOConverter implements IDTOConverter<AssignmentDTO, Assignment> {

    toBO(dto: AssignmentDTO): Assignment {

        const assignmentBO = new Assignment();

        assignmentBO.id        = dto.id;
        assignmentBO.createdAt = dto.createdAt;

        const project = new Project();
        project.id = dto.projectId;
        assignmentBO.project = project;

        const teamMember = new TeamMember();
        teamMember.id = dto.teamMemberId;
        assignmentBO.teamMember = teamMember;

        return assignmentBO;

    }

    toDTO(bo: Assignment): AssignmentDTO {

        const assignmentDTO: AssignmentDTO = {} as AssignmentDTO;

        assignmentDTO.id           = bo.id;
        assignmentDTO.projectId    = bo.project.id;
        assignmentDTO.teamMemberId = bo.teamMember.id;
        assignmentDTO.createdAt    = bo.createdAt;

        if (bo.teamMember) {
            assignmentDTO.teamMember = {} as TeamMemberDTO;
            assignmentDTO.teamMember.id          = bo.teamMember.id;
            assignmentDTO.teamMember.workspaceId = bo.teamMember.workspace?.id ?? null!;
            assignmentDTO.teamMember.userId      = bo.teamMember.userId;
            assignmentDTO.teamMember.email       = bo.teamMember.email;
            assignmentDTO.teamMember.firstName   = bo.teamMember.firstName;
            assignmentDTO.teamMember.lastName    = bo.teamMember.lastName;
            assignmentDTO.teamMember.role        = bo.teamMember.role;
            assignmentDTO.teamMember.status      = bo.teamMember.status;
            assignmentDTO.teamMember.createdAt   = bo.teamMember.createdAt;
            assignmentDTO.teamMember.updatedAt   = bo.teamMember.updatedAt;
        } else {
            assignmentDTO.teamMember = null;
        }

        return assignmentDTO;

    }

}
