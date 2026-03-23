import { AppErrors }              from "../error/AppError.js";
import type { Company }           from "../../domain/model/Company.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


export class DeleteCompanyUseCase implements IUseCase<Company, boolean> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: Company): Promise<boolean> {
        
        const success: boolean = await this.companyRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Cannot update Company', 'CANNOT_UPDATE_COMPANY');
        }

        return success;

    }

}