import type { Quote }           from "../../domain/model/Quote.js";
import type { IUseCase }        from "./IUseCase.js";
import type { QuoteStatuses }   from "../../domain/enums/QuoteStatuses.js";
import type { QuoteRepository } from "../../domain/repositories/QuoteRepository.js";


interface UpdateQuoteStatusInput {
    quoteId: string;
    status:  QuoteStatuses;
}

export class UpdateQuoteStatusUseCase implements IUseCase<UpdateQuoteStatusInput, Quote> {

    public constructor(private readonly quoteRepository: QuoteRepository) {}

    public async execute(input: UpdateQuoteStatusInput): Promise<Quote> {

        return this.quoteRepository.updateStatus(input.quoteId, input.status);

    }

}
