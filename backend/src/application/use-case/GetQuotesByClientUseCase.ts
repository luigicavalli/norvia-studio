import { AppErrors }                  from "../error/AppError.js";
import type { Quote }                from "../../domain/model/Quote.js";
import type { IUseCase }             from "./IUseCase.js";
import type { QuoteRepository }      from "../../domain/repositories/QuoteRepository.js";
import type { TeamMemberRepository } from "../../domain/repositories/TeamMemberRepository.js";


interface GetQuotesByClientInput {
    workspaceId: string;
    clientId:    string;
    userId:      string;
    limit?:      number;
    offset?:     number;
}

export class GetQuotesByClientUseCase implements IUseCase<GetQuotesByClientInput, Quote[]> {

    public constructor(
        private readonly quoteRepository:      QuoteRepository,
        private readonly teamMemberRepository: TeamMemberRepository,
    ) {}

    public async execute(input: GetQuotesByClientInput): Promise<Quote[]> {

        const member = await this.teamMemberRepository.findByWorkspaceAndUser(input.workspaceId, input.userId);

        if (!member) {
            throw AppErrors.forbidden('Not a member of this workspace', 'FORBIDDEN');
        }

        return this.quoteRepository.findByClient(input.workspaceId, input.clientId, input.limit, input.offset);

    }

}
