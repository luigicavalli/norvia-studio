import type { Quote }         from "../model/Quote.js";
import type { IRepository }   from "./IRepository.js";
import type { QuoteStatuses } from "../enums/QuoteStatuses.js";


export interface QuoteRepository extends IRepository<string, Quote> {

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Quote[]>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Quote[]>;

    updateStatus(quoteId: string, status: QuoteStatuses): Promise<Quote>;

};
