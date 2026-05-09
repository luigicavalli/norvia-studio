import type { Quote }           from "../../domain/model/Quote.js";
import type { IUseCase }        from "./IUseCase.js";
import type { QuoteRepository } from "../../domain/repositories/QuoteRepository.js";


export class CreateQuoteUseCase implements IUseCase<Quote, Quote> {

    public constructor(private readonly quoteRepository: QuoteRepository) {}

    public async execute(input: Quote): Promise<Quote> {

        return this.quoteRepository.save(input);

    }

}
