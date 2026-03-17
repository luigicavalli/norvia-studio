import type { Company } from "../model/Company.js";
import type { IRepository } from "./IRepository.js";

export interface CompanyRepository extends IRepository<string, Company> {

    findAll(limit?: number, offset?: number): Promise<Company[]>;

    findByTaxCode(taxCode: string): Promise<Company | null>;
    
}