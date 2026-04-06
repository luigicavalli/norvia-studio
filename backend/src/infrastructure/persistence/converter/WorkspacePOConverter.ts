import { Workspace }                  from "../../../domain/model/Workspace.js";
import { WorkspacePO }                from "../po/WorkspacePO.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class WorkspacePOConverter implements IPersistenceConverter<WorkspacePO, Workspace> {

    public toBO(po: WorkspacePO): Workspace {
        
        const workspaceBo: Workspace = new Workspace();

            workspaceBo.id        = po.id;
            workspaceBo.name      = po.name;
            workspaceBo.slug      = po.slug;
            workspaceBo.createdAt = po.created_at;
            workspaceBo.updatedAt = po.updated_at;

        return workspaceBo;

    };

    public toPO(bo: Workspace): WorkspacePO {
        
        const workspacePo: WorkspacePO = new WorkspacePO();

            workspacePo.id         = bo.id;
            workspacePo.name       = bo.name;
            workspacePo.slug       = bo.slug;
            workspacePo.created_at = bo.createdAt;
            workspacePo.updated_at = bo.updatedAt;

        return workspacePo;

    };
    
};