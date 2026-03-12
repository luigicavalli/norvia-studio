/**
 * ----
 * ENUM
 * ----
 */
import type { Currencies } from "../enums/Currencies.js";


export interface IBudget {

    amount:   number;
    currency: Currencies;

};

export class Budget implements IBudget {

    private _amount:   number;
    private _currency: Currencies;

    /* ***************
     * Getter & Setter
     */

    public get amount(): number {
        return this._amount;
    }

    public set amount(value: number) {
        this._amount = value;
    }

    public get currency(): Currencies {
        return this._currency;
    }

    public set currency(value: Currencies) {
        this._currency = value;
    }

};