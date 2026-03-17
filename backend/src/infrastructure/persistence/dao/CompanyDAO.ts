import type { CompanyPO }   from "../po/CompanyPO.js";
import type { IGenericDAO } from "./IGenericDAO.js";

export interface CompanyDAO extends IGenericDAO<string, CompanyPO> {

    findByTaxCode(taxCode: string): Promise<CompanyPO | null>;

};