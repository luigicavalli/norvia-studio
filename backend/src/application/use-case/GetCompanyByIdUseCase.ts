import type { Company }           from "../../domain/model/Company.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


export class GetCompanyByIdUseCase implements IUseCase<string, Company> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: string): Promise<Company> {
        
        const company: Company | null = await this.companyRepository.findById(input);

        if (!company) {
            throw new Error();
        }

        return company;

    }

}