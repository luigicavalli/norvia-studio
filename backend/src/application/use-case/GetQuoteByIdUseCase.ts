import { AppErrors }             from "../error/AppError.js";
import type { Quote }           from "../../domain/model/Quote.js";
import type { IUseCase }        from "./IUseCase.js";
import type { QuoteRepository } from "../../domain/repositories/QuoteRepository.js";


export class GetQuoteByIdUseCase implements IUseCase<string, Quote> {

    public constructor(private readonly quoteRepository: QuoteRepository) {}

    public async execute(input: string): Promise<Quote> {

        const quote = await this.quoteRepository.findById(input);

        if (!quote) {
            throw AppErrors.notFound('Quote not found', 'QUOTE_NOT_FOUND');
        }

        return quote;

    }

}
