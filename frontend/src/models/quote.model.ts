export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuoteItem {
  id:          string;
  quoteId:     string;
  description: string;
  quantity:    number;
  unitPrice:   number;
  currency:    string;
}

export interface Quote {
  id:          string;
  workspaceId: string;
  clientId:    string;
  clientName:  string;
  items:       QuoteItem[];
  number:      number;
  status:      QuoteStatus;
  issueDate:   Date | null;
  expiresAt:   Date | null;
  notes:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface SaveQuoteItemData {
  id:          string;
  description: string;
  quantity:    number;
  unitPrice:   number;
  currency:    string;
}

export interface SaveQuoteData {
  clientId:  string;
  number:    number;
  status:    QuoteStatus;
  issueDate: Date | null;
  expiresAt: Date | null;
  notes:     string;
  items:     SaveQuoteItemData[];
}
