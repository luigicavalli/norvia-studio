import type { CompanyPO, ICompanyPO } from "./CompanyPO.js";

export interface IClientPO {

    id:         string;
    first_name: string;
    last_name:  string;
    email:      string;
    phone:      number;
    company:    ICompanyPO;
    vat_number: string;
    status:     string;
    notes:      string;
    created_at: Date;
    updated_at: Date;

};

export class ClientPO implements IClientPO {

    private _id:          string;
    private _first_name:  string;
    private _last_name:   string;
    private _email:       string;
    private _phone:       number;
    private _company:     CompanyPO;
    private _vat_number:  string;
    private _status:      string;
    private _notes:       string;
    private _created_at:  Date;
    private _updated_at:  Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get first_name(): string {
        return this._first_name;
    }

    public set first_name(value: string) {
        this._first_name = value;
    }

    public get last_name(): string {
        return this._last_name;
    }

    public set last_name(value: string) {
        this._last_name = value;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        this._email = value;
    }

    public get phone(): number {
        return this._phone;
    }

    public set phone(value: number) {
        this._phone = value;
    }

    public get company(): CompanyPO {
        return this._company;
    }

    public set company(value: CompanyPO) {
        this._company = value;
    }

    public get vat_number(): string {
        return this._vat_number;
    }

    public set vat_number(value: string) {
        this._vat_number = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
    }

    public get notes(): string {
        return this._notes;
    }

    public set notes(value: string) {
        this._notes = value;
    }

    public get created_at(): Date {
        return this._created_at;
    }

    public set created_at(value: Date) {
        this._created_at = value;
    }

    public get updated_at(): Date {
        return this._updated_at;
    }

    public set updated_at(value: Date) {
        this._updated_at = value;
    }

    public flatten(): any {
        return {
            id:         this.id,
            first_name: this.first_name,
            last_name:  this.last_name,
            email:      this.email,
            phone:      this.phone,
            company:    this.company.id,
            vat_number: this.vat_number,
            status:     this.status,
            notes:      this.notes,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

};