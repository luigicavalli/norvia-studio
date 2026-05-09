import type { InvoiceItemDTO } from "./InvoiceItemDTO.js";

export interface InvoiceDTO {

    id:          string;
    workspaceId: string;
    clientId:    string;
    clientName:  string;
    projectId:   string | null;
    items:       InvoiceItemDTO[];
    number:      number;
    status:      string;
    issueDate:   Date;
    dueDate:     Date;
    paidAt:      Date | null;
    notes:       string;
    createdAt:   Date;
    updatedAt:   Date;

};
