import { AppErrors }             from "../error/AppError.js";
import type { Quote }           from "../../domain/model/Quote.js";
import type { IUseCase }        from "./IUseCase.js";
import type { QuoteRepository } from "../../domain/repositories/QuoteRepository.js";


export class UpdateQuoteUseCase implements IUseCase<Quote, Quote> {

    public constructor(private readonly quoteRepository: QuoteRepository) {}

    public async execute(input: Quote): Promise<Quote> {

        const existing = await this.quoteRepository.findById(input.id);

        if (!existing) {
            throw AppErrors.notFound('Quote not found', 'QUOTE_NOT_FOUND');
        }

        return this.quoteRepository.save(input);

    }

}
