import type { Client }      from "../model/Client.js";
import type { IRepository } from "./IRepository.js";

export interface ClientRepository extends IRepository<string, Client> {

    findAll(limit?: number, offset?: number): Promise<Client[]>;

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Client[]>;

    findByCompany(workspaceId: string, companyId: string, limit?: number, offset?: number): Promise<Client[]>;

    findByEmail(workspaceId: string, email: string): Promise<Client | null>;

};
