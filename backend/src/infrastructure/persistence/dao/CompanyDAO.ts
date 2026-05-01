import type { CompanyPO }   from "../po/CompanyPO.js";
import type { IGenericDAO } from "./IGenericDAO.js";


export interface CompanyDAO extends IGenericDAO<string, CompanyPO> {

    findAll(limit?: number, offset?: number): Promise<CompanyPO[]>;

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<CompanyPO[]>;

    findById(id: string): Promise<CompanyPO | null>;

    findByTaxCode(workspaceId: string, taxCode: string): Promise<CompanyPO | null>;

    save(entity: CompanyPO): Promise<CompanyPO>;

    delete(entity: CompanyPO): Promise<boolean>;

};