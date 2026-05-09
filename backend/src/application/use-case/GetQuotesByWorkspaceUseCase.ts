import { AppErrors }                from "../error/AppError.js";
import type { Quote }              from "../../domain/model/Quote.js";
import type { TeamMember }         from "../../domain/model/TeamMember.js";
import type { IUseCase }           from "./IUseCase.js";
import type { QuoteRepository }    from "../../domain/repositories/QuoteRepository.js";
import type { TeamMemberRepository } from "../../domain/repositories/TeamMemberRepository.js";


interface GetQuotesByWorkspaceInput {
    workspaceId: string;
    userId:      string;
    limit?:      number;
    offset?:     number;
}

export class GetQuotesByWorkspaceUseCase implements IUseCase<GetQuotesByWorkspaceInput, Quote[]> {

    public constructor(
        private readonly quoteRepository:      QuoteRepository,
        private readonly teamMemberRepository: TeamMemberRepository,
    ) {}

    public async execute(input: GetQuotesByWorkspaceInput): Promise<Quote[]> {

        const member: TeamMember | null = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.quoteRepository.findByWorkspace(input.workspaceId, input.limit, input.offset);

    }

}
