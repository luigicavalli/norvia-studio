export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  id:          string;
  invoiceId:   string;
  description: string;
  quantity:    number;
  unitPrice:   number;
  currency:    string;
}

export interface Invoice {
  id:          string;
  workspaceId: string;
  clientId:    string;
  clientName:  string;
  projectId:   string | null;
  items:       InvoiceItem[];
  number:      number;
  status:      InvoiceStatus;
  issueDate:   Date | null;
  dueDate:     Date | null;
  paidAt:      Date | null;
  notes:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface SaveInvoiceItemData {
  id:          string;
  description: string;
  quantity:    number;
  unitPrice:   number;
  currency:    string;
}

export interface SaveInvoiceData {
  clientId:  string;
  number:    number;
  status:    InvoiceStatus;
  issueDate: Date | null;
  dueDate:   Date | null;
  notes:     string;
  items:     SaveInvoiceItemData[];
}
