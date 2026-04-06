export class CompanyPO {

    private _id:           string;
    private _workspace_id: string;
    private _name:         string;
    private _tax_code:     string;
    private _email:        string;
    private _phone:        number;
    private _address:      string;
    private _city:         string;
    private _zip_code:     number;
    private _country:      string;
    private _website:      string;
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

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get tax_code(): string {
        return this._tax_code;
    }

    public set tax_code(value: string) {
        this._tax_code = value;
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

    public get address(): string {
        return this._address;
    }

    public set address(value: string) {
        this._address = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get zip_code(): number {
        return this._zip_code;
    }

    public set zip_code(value: number) {
        this._zip_code = value;
    }

    public get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = value;
    }

    public get website(): string {
        return this._website;
    }

    public set website(value: string) {
        this._website = value;
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