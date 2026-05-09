export interface InvoiceItemDTO {

    id:          string;
    invoiceId:   string;
    description: string;
    quantity:    number;
    unitPrice:   number;
    currency:    string;

};
