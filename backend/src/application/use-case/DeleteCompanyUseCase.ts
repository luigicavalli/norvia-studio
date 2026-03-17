import { AppErrors }              from "../error/AppError.js";
import type { IUseCase }          from "./IUseCase.js";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository.js";


export class DeleteCompanyUseCase implements IUseCase<string, boolean> {

    public constructor(private readonly companyRepository: CompanyRepository) {}

    public async execute(input: string): Promise<boolean> {
        
        const success: boolean = await this.companyRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Cannot update Company', 'CANNOT_UPDATE_COMPANY');
        }

        return success;

    }

}