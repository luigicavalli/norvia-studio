export class ClientPO {

    private _id:           string;
    private _workspace_id: string;
    private _first_name:   string;
    private _last_name:    string;
    private _email:        string;
    private _phone:        number;
    private _company_id:   string;
    private _vat_number:   string;
    private _status:       string;
    private _notes:        string;
    private _created_at:   Date;
    private _updated_at:   Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get workspace_id(): string {
        return this._workspace_id;
    }

    public set workspace_id(value: string) {
        this._workspace_id = value;
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

    public get company_id(): string {
        return this._company_id;
    }

    public set company_id(value: string) {
        this._company_id = value;
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

};