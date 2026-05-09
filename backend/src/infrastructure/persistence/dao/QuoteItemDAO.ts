import type { IGenericDAO } from "./IGenericDAO.js";
import type { QuoteItemPO } from "../po/QuoteItemPO.js";


export interface QuoteItemDAO extends IGenericDAO<string, QuoteItemPO> {

    findByQuote(quoteId: string): Promise<QuoteItemPO[]>;

    findByQuotes(quoteIds: string[]): Promise<QuoteItemPO[]>;

    deleteByQuote(quoteId: string): Promise<void>;

    findById(id: string): Promise<QuoteItemPO | null>;

    save(entity: QuoteItemPO): Promise<QuoteItemPO>;

    delete(entity: QuoteItemPO): Promise<boolean>;

};
