import { Workspace }              from "../../domain/model/Workspace.js";
import type { WorkspaceDTO }      from "../dto/WorkspaceDTO.js";
import type { IDTOConverter }     from "./IDTOConverter.js";


export class WorkspaceDTOConverter implements IDTOConverter<WorkspaceDTO, Workspace> {

    public toBO(dto: WorkspaceDTO): Workspace {

        const workspaceBo: Workspace = new Workspace();

            workspaceBo.id          = dto.id;
            workspaceBo.name        = dto.name;
            workspaceBo.slug        = dto.slug;
            workspaceBo.description = dto.description ?? null;
            workspaceBo.createdAt   = dto.createdAt;
            workspaceBo.updatedAt   = dto.updatedAt;
            console.log("🚀 ~ WorkspaceDTOConverter ~ toBO ~ workspaceBo:", workspaceBo)

        return workspaceBo;

    }

    public toDTO(bo: Workspace): WorkspaceDTO {

        return {
            id:          bo.id,
            name:        bo.name,
            slug:        bo.slug,
            description: bo.description,
            createdAt:   bo.createdAt,
            updatedAt:   bo.updatedAt,
        };

    }

}
