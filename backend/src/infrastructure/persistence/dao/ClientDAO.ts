import type { ClientPO }    from "../po/ClientPO.js";
import type { IGenericDAO } from "./IGenericDAO.js";


export interface ClientDAO extends IGenericDAO<string, ClientPO[]> {

    findByCompany(companyId: string): Promise<ClientPO[]>

    findByEmail(email: string): Promise<ClientPO | null>;

};