import { AppErrors }                  from "../error/AppError.js";
import type { Client }                from "../../domain/model/Client.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { ClientRepository }      from "../../domain/repositories/ClientRepository.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetClientsByCompanyInput {
    workspaceId: string;
    companyId:   string;
    userId:      string;
    limit?:      number | undefined;
    offset?:     number | undefined;
}

export class GetClientsByCompanyUseCase implements IUseCase<GetClientsByCompanyInput, Client[]> {

    public constructor(
        private readonly clientRepository:     ClientRepository,
        private readonly teamMemberRepository: TeamMemberRepository
    ) {}

    public async execute(input: GetClientsByCompanyInput): Promise<Client[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.clientRepository.findByCompany(input.workspaceId, input.companyId, input.limit, input.offset);

    }

}
