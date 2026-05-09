import { AppErrors }                  from "../error/AppError.js";
import type { Invoice }               from "../../domain/model/Invoice.js";
import type { TeamMember }            from "../../domain/model/TeamMember.js";
import type { IUseCase }              from "./IUseCase.js";
import type { InvoiceRepository }     from "../../domain/repositories/InvoiceRepository.js";
import type { TeamMemberRepository }  from "../../domain/repositories/TeamMemberRepository.js";


interface GetInvoicesByWorkspaceInput {
    workspaceId: string;
    userId:      string;
    limit?:      number;
    offset?:     number;
}

export class GetInvoicesByWorkspaceUseCase implements IUseCase<GetInvoicesByWorkspaceInput, Invoice[]> {

    public constructor(
        private readonly invoiceRepository:    InvoiceRepository,
        private readonly teamMemberRepository: TeamMemberRepository,
    ) {}

    public async execute(input: GetInvoicesByWorkspaceInput): Promise<Invoice[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.invoiceRepository.findByWorkspace(input.workspaceId, input.limit, input.offset);

    }

}
