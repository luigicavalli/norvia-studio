import { AppErrors }              from "../error/AppError.js";
import type { Company }           from "../../domain/model/Company.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


export class UpdateCompanyUseCase implements IUseCase<Company, Company> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: Company): Promise<Company> {

        const existingCompany: Company | null = await this.companyRepository.findById(input.id);
        
        if (!existingCompany) {
            throw AppErrors.notFound('Company not found', 'COMPANY_NOT_FOUND');
        }
        
        const company: Company = await this.companyRepository.save(input);

        return company;

    }

}