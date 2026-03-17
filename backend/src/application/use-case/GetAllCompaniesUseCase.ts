import type { Company }           from "../../domain/model/Company.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


interface GetAllCompaniesInput {
    limit?:  number,
    offset?: number
}

export class GetAllCompaniesUseCase implements IUseCase<GetAllCompaniesInput, Company[]> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: GetAllCompaniesInput): Promise<Company[]> {

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;

        const companies: Company[] = await this.companyRepository.findAll(limit, offset);

        return companies;

    }

}