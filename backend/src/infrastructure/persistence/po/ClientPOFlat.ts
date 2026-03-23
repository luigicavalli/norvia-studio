export interface IClientPOFlat {

    client_id:               string;
    client_first_name:       string;
    client_last_name:        string;
    client_email:            string;
    client_phone:            number;
    client_vat_number:       string;
    client_status:           string;
    client_notes:            string;
    client_created_at:       Date;
    client_updated_at:       Date;

    client_company_id:       string;
    client_company_name:     string;
    client_company_tax_code: string;
    client_company_email:    string;
    client_company_phone:    number;
    client_company_address:  string;
    client_company_city:     string;
    client_company_zip_code: number;
    client_company_country:  string;
    client_company_website:  string;

};

export class ClientPOFlat implements IClientPOFlat {

    private _client_id:               string;
    private _client_first_name:       string;
    private _client_last_name:        string;
    private _client_email:            string;
    private _client_phone:            number;
    private _client_vat_number:       string;
    private _client_status:           string;
    private _client_notes:            string;
    private _client_created_at:       Date;
    private _client_updated_at:       Date;

    private _client_company_id:       string;
    private _client_company_name:     string;
    private _client_company_tax_code: string;
    private _client_company_email:    string;
    private _client_company_phone:    number;
    private _client_company_address:  string;
    private _client_company_city:     string;
    private _client_company_zip_code: number;
    private _client_company_country:  string;
    private _client_company_website:  string;

    /* ***************
     * Getter & Setter
     */

    public get client_id(): string {
        return this._client_id;
    }

    public set client_id(value: string) {
        this._client_id = value;
    }

    public get client_first_name(): string {
        return this._client_first_name;
    }

    public set client_first_name(value: string) {
        this._client_first_name = value;
    }

    public get client_last_name(): string {
        return this._client_last_name;
    }

    public set client_last_name(value: string) {
        this._client_last_name = value;
    }

    public get client_email(): string {
        return this._client_email;
    }

    public set client_email(value: string) {
        this._client_email = value;
    }

    public get client_phone(): number {
        return this._client_phone;
    }

    public set client_phone(value: number) {
        this._client_phone = value;
    }

    public get client_vat_number(): string {
        return this._client_vat_number;
    }

    public set client_vat_number(value: string) {
        this._client_vat_number = value;
    }

    public get client_status(): string {
        return this._client_status;
    }

    public set client_status(value: string) {
        this._client_status = value;
    }

    public get client_notes(): string {
        return this._client_notes;
    }

    public set client_notes(value: string) {
        this._client_notes = value;
    }

    public get client_created_at(): Date {
        return this._client_created_at;
    }

    public set client_created_at(value: Date) {
        this._client_created_at = value;
    }

    public get client_updated_at(): Date {
        return this._client_updated_at;
    }

    public set client_updated_at(value: Date) {
        this._client_updated_at = value;
    }

    public get client_company_id(): string {
        return this._client_company_id;
    }

    public set client_company_id(value: string) {
        this._client_company_id = value;
    }

    public get client_company_name(): string {
        return this._client_company_name;
    }

    public set client_company_name(value: string) {
        this._client_company_name = value;
    }

    public get client_company_tax_code(): string {
        return this._client_company_tax_code;
    }

    public set client_company_tax_code(value: string) {
        this._client_company_tax_code = value;
    }

    public get client_company_email(): string {
        return this._client_company_email;
    }

    public set client_company_email(value: string) {
        this._client_company_email = value;
    }

    public get client_company_phone(): number {
        return this._client_company_phone;
    }

    public set client_company_phone(value: number) {
        this._client_company_phone = value;
    }

    public get client_company_address(): string {
        return this._client_company_address;
    }

    public set client_company_address(value: string) {
        this._client_company_address = value;
    }

    public get client_company_city(): string {
        return this._client_company_city;
    }

    public set client_company_city(value: string) {
        this._client_company_city = value;
    }

    public get client_company_zip_code(): number {
        return this._client_company_zip_code;
    }

    public set client_company_zip_code(value: number) {
        this._client_company_zip_code = value;
    }

    public get client_company_country(): string {
        return this._client_company_country;
    }

    public set client_company_country(value: string) {
        this._client_company_country = value;
    }

    public get client_company_website(): string {
        return this._client_company_website;
    }

    public set client_company_website(value: string) {
        this._client_company_website = value;
    }

};
