import type { QuotePO }       from "../po/QuotePO.js";
import type { IGenericDAO }   from "./IGenericDAO.js";
import type { QuoteStatuses } from "../../../domain/enums/QuoteStatuses.js";


export interface QuoteDAO extends IGenericDAO<string, QuotePO> {

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<QuotePO[]>;

    findById(id: string): Promise<QuotePO | null>;

    findByIds(ids: string[]): Promise<QuotePO[]>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<QuotePO[]>;

    save(entity: QuotePO): Promise<QuotePO>;

    updateStatus(quoteId: string, status: QuoteStatuses): Promise<QuotePO>;

    delete(entity: QuotePO): Promise<boolean>;

};
