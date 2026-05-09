import { Invoice }                    from "../../../domain/model/Invoice.js";
import { InvoicePO }                  from "../po/InvoicePO.js";
import type { InvoiceStatus }         from "../../../domain/enums/InvoiceStatus.js";
import type { IPersistenceConverter } from "./IPersistenceConverter.js";


export class InvoicePOConverter implements IPersistenceConverter<InvoicePO, Invoice> {

    public toBO(po: InvoicePO): Invoice {

        const bo = new Invoice();

        bo.id        = po.id;
        bo.number    = po.number;
        bo.status    = po.status as InvoiceStatus;
        bo.issueDate = po.issue_date;
        bo.dueDate   = po.due_date;
        bo.paidAt    = po.paid_at ?? undefined;
        bo.notes     = po.notes;
        bo.createdAt = po.created_at;
        bo.updatedAt = po.updated_at;

        return bo;

    };

    public toPO(bo: Invoice): InvoicePO {

        const po = new InvoicePO();

        po.id           = bo.id;
        po.workspace_id = bo.workspace.id;
        po.client_id    = bo.client.id;
        po.project_id   = bo.project?.id ?? null;
        po.number       = bo.number;
        po.status       = bo.status;
        po.issue_date   = bo.issueDate;
        po.due_date     = bo.dueDate;
        po.paid_at      = bo.paidAt ?? null;
        po.notes        = bo.notes;
        po.created_at   = bo.createdAt;
        po.updated_at   = bo.updatedAt;

        return po;

    };

};
