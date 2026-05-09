import { Quote }                          from "../../domain/model/Quote.js";
import type { QuoteDTO }                  from "../dto/QuoteDTO.js";
import type { IDTOConverter }             from "../converter/IDTOConverter.js";
import { QuoteDTOConverter }              from "../converter/QuoteDTOConverter.js";
import type { QuoteStatuses }             from "../../domain/enums/QuoteStatuses.js";
import type { GetQuoteByIdUseCase }       from "../../application/use-case/GetQuoteByIdUseCase.js";
import type { CreateQuoteUseCase }        from "../../application/use-case/CreateQuoteUseCase.js";
import type { UpdateQuoteUseCase }        from "../../application/use-case/UpdateQuoteUseCase.js";
import type { DeleteQuoteUseCase }        from "../../application/use-case/DeleteQuoteUseCase.js";
import type { UpdateQuoteStatusUseCase }  from "../../application/use-case/UpdateQuoteStatusUseCase.js";
import type { GetQuotesByClientUseCase }  from "../../application/use-case/GetQuotesByClientUseCase.js";
import type { GetQuotesByWorkspaceUseCase } from "../../application/use-case/GetQuotesByWorkspaceUseCase.js";


export class QuoteController {

    private readonly converter: IDTOConverter<QuoteDTO, Quote> = new QuoteDTOConverter();

    public constructor(
        private readonly getQuotesByWorkspaceUC: GetQuotesByWorkspaceUseCase,
        private readonly getQuotesByClientUC:    GetQuotesByClientUseCase,
        private readonly getQuoteByIdUC:         GetQuoteByIdUseCase,
        private readonly createQuoteUC:          CreateQuoteUseCase,
        private readonly updateQuoteUC:          UpdateQuoteUseCase,
        private readonly updateQuoteStatusUC:    UpdateQuoteStatusUseCase,
        private readonly deleteQuoteUC:          DeleteQuoteUseCase,
    ) {}

    public async getByWorkspace(workspaceId: string, userId: string, limit?: number, offset?: number): Promise<QuoteDTO[]> {

        const records = await this.getQuotesByWorkspaceUC.execute({ workspaceId, userId, ...(limit !== undefined && { limit }), ...(offset !== undefined && { offset }) });

        return records.map(r => this.converter.toDTO(r));

    };

    public async getByClient(workspaceId: string, clientId: string, userId: string, limit?: number, offset?: number): Promise<QuoteDTO[]> {

        const records = await this.getQuotesByClientUC.execute({ workspaceId, clientId, userId, ...(limit !== undefined && { limit }), ...(offset !== undefined && { offset }) });

        return records.map(r => this.converter.toDTO(r));

    };

    public async getById(id: string): Promise<QuoteDTO> {

        const record = await this.getQuoteByIdUC.execute(id);

        return this.converter.toDTO(record);

    };

    public async save(dto: QuoteDTO): Promise<void> {

        const quote = this.converter.toBO(dto);

        await this.createQuoteUC.execute(quote);

    };

    public async update(dto: QuoteDTO): Promise<void> {

        const quote = this.converter.toBO(dto);

        await this.updateQuoteUC.execute(quote);

    };

    public async updateStatus(quoteId: string, status: QuoteStatuses): Promise<void> {

        await this.updateQuoteStatusUC.execute({ quoteId, status });

    };

    public async delete(id: string): Promise<void> {

        const quote = new Quote();
        quote.id = id;

        await this.deleteQuoteUC.execute(quote);

    };

};
