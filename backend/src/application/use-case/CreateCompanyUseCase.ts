import { AppErrors }              from "../error/AppError.js";
import type { Company }           from "../../domain/model/Company.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


export class CreateCompanyUseCase implements IUseCase<Company, Company> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: Company): Promise<Company> {

        const existingCompany: Company | null = await this.companyRepository.findByTaxCode(input.workspace.id, input.taxCode);

        if (existingCompany) {
            throw AppErrors.conflict('Company already exists', 'COMPANY_ALREADY_EXISTS');
        }
        
        const company: Company = await this.companyRepository.save(input);

        return company;

    }

}