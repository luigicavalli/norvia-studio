export class InvoiceItemPO {

    private _id:          string;
    private _invoice_id:  string;
    private _description: string;
    private _quantity:    number;
    private _unit_price:  number;
    private _currency:    string;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get invoice_id(): string {
        return this._invoice_id;
    }

    public set invoice_id(value: string) {
        this._invoice_id = value;
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

    public get unit_price(): number {
        return this._unit_price;
    }

    public set unit_price(value: number) {
        this._unit_price = value;
    }

    public get currency(): string {
        return this._currency;
    }

    public set currency(value: string) {
        this._currency = value;
    }

};
