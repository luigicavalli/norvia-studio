import type { ClientPO }     from "../po/ClientPO.js";
import type { IGenericDAO }  from "./IGenericDAO.js";
import type { ClientPOFlat } from "../po/ClientPOFlat.js";


export interface ClientDAO extends IGenericDAO<string, ClientPO | ClientPOFlat> {

    findAll(limit?: number, offset?: number): Promise<ClientPOFlat[]>;

    findByCompany(companyId: string, limit?: number, offset?: number): Promise<ClientPOFlat[]>

    findByEmail(email: string): Promise<ClientPOFlat | null>;

    findById(id: string): Promise<ClientPOFlat | null>;

    save(entity: ClientPO): Promise<ClientPO>;

    delete(entity: ClientPO): Promise<boolean>;

};