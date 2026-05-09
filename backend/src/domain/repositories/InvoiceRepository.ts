import type { Invoice }       from "../model/Invoice.js";
import type { IRepository }   from "./IRepository.js";
import type { InvoiceStatus } from "../enums/InvoiceStatus.js";


export interface InvoiceRepository extends IRepository<string, Invoice> {

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Invoice[]>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<Invoice[]>;

    findByProject(projectId: string): Promise<Invoice[]>;

    updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice>;

};
