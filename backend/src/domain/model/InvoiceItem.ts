/**
 * --------
 * ENTITIES
 * --------
 */
import type { IInvoice, Invoice } from "./Invoice.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { Currencies } from "../enums/Currencies.js";


export interface IInvoiceItem {

    id:          string;
    invoice:     IInvoice;
    description: string;
    quantity:    number;
    unitPrice:   number;
    currency:    Currencies;

};

export class InvoiceItem implements IInvoiceItem {

    private _id: string;
    private _invoice: Invoice;
    private _description: string;
    private _quantity: number;
    private _unitPrice: number;
    private _currency: Currencies;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get invoice(): Invoice {
        return this._invoice;
    }

    public set invoice(value: Invoice) {
        this._invoice = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(value: number) {
        this._quantity = value;
    }

    public get unitPrice(): number {
        return this._unitPrice;
    }

    public set unitPrice(value: number) {
        this._unitPrice = value;
    }

    public get currency(): Currencies {
        return this._currency;
    }

    public set currency(value: Currencies) {
        this._currency = value;
    }
    
};