import type { InvoicePO }     from "../po/InvoicePO.js";
import type { IGenericDAO }   from "./IGenericDAO.js";
import type { InvoiceStatus } from "../../../domain/enums/InvoiceStatus.js";


export interface InvoiceDAO extends IGenericDAO<string, InvoicePO> {

    findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<InvoicePO[]>;

    findById(id: string): Promise<InvoicePO | null>;

    findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<InvoicePO[]>;

    findByProject(projectId: string): Promise<InvoicePO[]>;

    save(entity: InvoicePO): Promise<InvoicePO>;

    updateStatus(invoiceId: string, status: InvoiceStatus): Promise<InvoicePO>;

    delete(entity: InvoicePO): Promise<boolean>;

};
