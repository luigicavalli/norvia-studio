import { AppErrors }                  from "../error/AppError.js";
import type { Company }               from "../../domain/model/Company.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { CompanyRepository }     from "../../domain/repositories/CompanyRepository.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetAllCompaniesInput {
    workspaceId: string;
    userId:      string;
    limit?:      number | undefined;
    offset?:     number | undefined;
}

export class GetAllCompaniesUseCase implements IUseCase<GetAllCompaniesInput, Company[]> {

    public constructor(
        private readonly companyRepository:    CompanyRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: GetAllCompaniesInput): Promise<Company[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.companyRepository.findByWorkspace(input.workspaceId, input.limit, input.offset);

    }

}
