import type { Workspace }  from "../model/Workspace.js";
import type { IRepository } from "./IRepository.js";

export interface WorkspaceRepository extends IRepository<string, Workspace> {

    findAll(): Promise<Workspace[]>;

    findById(id: string): Promise<Workspace | null>;

    findBySlug(slug: string): Promise<Workspace | null>;

    findByUserId(userId: string): Promise<Workspace[]>;

};
