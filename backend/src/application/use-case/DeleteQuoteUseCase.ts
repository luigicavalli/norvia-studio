import { AppErrors }             from "../error/AppError.js";
import type { Quote }           from "../../domain/model/Quote.js";
import type { IUseCase }        from "./IUseCase.js";
import type { QuoteRepository } from "../../domain/repositories/QuoteRepository.js";


export class DeleteQuoteUseCase implements IUseCase<Quote, boolean> {

    public constructor(private readonly quoteRepository: QuoteRepository) {}

    public async execute(input: Quote): Promise<boolean> {

        const success = await this.quoteRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Quote not found', 'QUOTE_NOT_FOUND');
        }

        return success;

    }

}
