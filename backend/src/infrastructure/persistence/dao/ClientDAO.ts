import type { ClientPO }    from "../po/ClientPO.js";
import type { IGenericDAO } from "./IGenericDAO.js";


export interface ClientDAO extends IGenericDAO<string, ClientPO> {

    findAll(limit?: number, offset?: number): Promise<ClientPO[]>;

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ClientPO[]>;

    findById(id: string): Promise<ClientPO | null>;

    findByIds(ids: string[]): Promise<ClientPO[]>;

    findByCompany(workspaceId: string, companyId: string, limit?: number, offset?: number): Promise<ClientPO[]>;

    findByEmail(workspaceId: string, email: string): Promise<ClientPO | null>;

    save(entity: ClientPO): Promise<ClientPO>;

    delete(entity: ClientPO): Promise<boolean>;

};