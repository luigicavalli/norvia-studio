import type { QuoteItemDTO } from "./QuoteItemDTO.js";

export interface QuoteDTO {

    id:          string;
    workspaceId: string;
    clientId:    string;
    clientName:  string;
    items:       QuoteItemDTO[];
    number:      number;
    status:      string;
    issueDate:   Date;
    expiresAt:   Date;
    notes:       string;
    createdAt:   Date;
    updatedAt:   Date;

};
