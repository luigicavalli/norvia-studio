import type { WorkspacePO } from "../po/WorkspacePO.js";
import type { IGenericDAO } from "./IGenericDAO.js";

export interface WorkspaceDAO extends IGenericDAO<string, WorkspacePO> {

    findAll(): Promise<WorkspacePO[]>;

    findById(id: string): Promise<WorkspacePO | null>;

    findByIds(ids: string[]): Promise<WorkspacePO[]>;

    findBySlug(slug: string): Promise<WorkspacePO | null>;

    save(entity: WorkspacePO): Promise<WorkspacePO>;

    delete(entity: WorkspacePO): Promise<boolean>;

};
