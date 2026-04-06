import type { IGenericDAO }   from "./IGenericDAO.js";
import type { InvoiceItemPO } from "../po/InvoiceItemPO.js";


export interface InvoiceItemDAO extends IGenericDAO<string, InvoiceItemPO> {

    findByInvoice(invoiceId: string): Promise<InvoiceItemPO[]>;

    findById(id: string): Promise<InvoiceItemPO | null>;

    save(entity: InvoiceItemPO): Promise<InvoiceItemPO>;

    delete(entity: InvoiceItemPO): Promise<boolean>;

};
