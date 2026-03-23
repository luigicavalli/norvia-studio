import type { Company }               from "../../../domain/model/Company.js";
import type { CompanyPO }             from "../po/CompanyPO.js";
import type { CompanyDAO }            from "../dao/CompanyDAO.js";
import { CompanyPOConverter }         from "../converter/CompanyPOConverter.js";
import type { CompanyRepository }     from "../../../domain/repositories/CompanyRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class CompanyRepositoryImpl implements CompanyRepository {

    private readonly converter: IPersistenceConverter<CompanyPO, Company> = new CompanyPOConverter();

    public constructor(private readonly dao: CompanyDAO) {}

    public async findAll(limit?: number, offset?: number): Promise<Company[]> {
        
        const companies: Company[] = [];
        
        const records: CompanyPO[] = await this.dao.findAll(limit, offset);

        records.forEach((record: CompanyPO) => {
            const company: Company = this.converter.toBO(record);

            companies.push(company);
        });

        return companies;

    };

    public async findByTaxCode(taxCode: string): Promise<Company | null> {
        
        const record: CompanyPO | null = await this.dao.findByTaxCode(taxCode);

        if (!record) {
            return null;
        }

        const company: Company = this.converter.toBO(record);

        return company;
        
    };

    public async findById(id: string): Promise<Company | null> {

        const record: CompanyPO | null = await this.dao.findById(id);

        if (!record) {
            return null;
        }

        const company: Company = this.converter.toBO(record);

        return company;

    };

    public async save(entity: Company): Promise<Company> {
        
        const companyPO: CompanyPO = this.converter.toPO(entity);

        const record: CompanyPO = await this.dao.save(companyPO);

        const createdCompany: Company = this.converter.toBO(record);

        return createdCompany;

    };
    
    public async delete(entity: Company): Promise<boolean> {

        const companyPO: CompanyPO = this.converter.toPO(entity);

        const success: boolean = await this.dao.delete(companyPO);

        return success ? true : false;

    };
    
};