export interface IProjectPOFlat {

    project_id:                  string;
    project_name:                string;
    project_description:         string;
    project_status:              string;
    project_priority:            string;
    project_budget_amount:       number;
    project_budget_currency:     string;
    project_start_date:          Date;
    project_due_date:            Date;
    project_completed_at:        Date;
    project_created_at:          Date;
    project_updated_at:          Date;

    project_client_id:           string;
    project_client_first_name:   string;
    project_client_last_name:    string;
    project_client_email:        string;

    project_client_company_id:   string;
    project_client_company_name: string;

};

export class ProjectPOFlat implements IProjectPOFlat {

    private _project_id:                  string;
    private _project_name:                string;
    private _project_description:         string;
    private _project_status:              string;
    private _project_priority:            string;
    private _project_budget_amount:       number;
    private _project_budget_currency:     string;
    private _project_start_date:          Date;
    private _project_due_date:            Date;
    private _project_completed_at:        Date;
    private _project_created_at:          Date;
    private _project_updated_at:          Date;

    private _project_client_id:           string;
    private _project_client_first_name:   string;
    private _project_client_last_name:    string;
    private _project_client_email:        string;

    private _project_client_company_id:   string;
    private _project_client_company_name: string;

    /* ***************
     * Getter & Setter
     */

    public get project_id(): string {
        return this._project_id;
    }

    public set project_id(value: string) {
        this._project_id = value;
    }

    public get project_name(): string {
        return this._project_name;
    }

    public set project_name(value: string) {
        this._project_name = value;
    }

    public get project_description(): string {
        return this._project_description;
    }

    public set project_description(value: string) {
        this._project_description = value;
    }

    public get project_status(): string {
        return this._project_status;
    }

    public set project_status(value: string) {
        this._project_status = value;
    }

    public get project_priority(): string {
        return this._project_priority;
    }

    public set project_priority(value: string) {
        this._project_priority = value;
    }

    public get project_budget_amount(): number {
        return this._project_budget_amount;
    }

    public set project_budget_amount(value: number) {
        this._project_budget_amount = value;
    }

    public get project_budget_currency(): string {
        return this._project_budget_currency;
    }

    public set project_budget_currency(value: string) {
        this._project_budget_currency = value;
    }

    public get project_start_date(): Date {
        return this._project_start_date;
    }

    public set project_start_date(value: Date) {
        this._project_start_date = value;
    }

    public get project_due_date(): Date {
        return this._project_due_date;
    }

    public set project_due_date(value: Date) {
        this._project_due_date = value;
    }

    public get project_completed_at(): Date {
        return this._project_completed_at;
    }

    public set project_completed_at(value: Date) {
        this._project_completed_at = value;
    }

    public get project_created_at(): Date {
        return this._project_created_at;
    }

    public set project_created_at(value: Date) {
        this._project_created_at = value;
    }

    public get project_updated_at(): Date {
        return this._project_updated_at;
    }

    public set project_updated_at(value: Date) {
        this._project_updated_at = value;
    }

    public get project_client_id(): string {
        return this._project_client_id;
    }

    public set project_client_id(value: string) {
        this._project_client_id = value;
    }

    public get project_client_first_name(): string {
        return this._project_client_first_name;
    }

    public set project_client_first_name(value: string) {
        this._project_client_first_name = value;
    }

    public get project_client_last_name(): string {
        return this._project_client_last_name;
    }

    public set project_client_last_name(value: string) {
        this._project_client_last_name = value;
    }

    public get project_client_email(): string {
        return this._project_client_email;
    }

    public set project_client_email(value: string) {
        this._project_client_email = value;
    }

    public get project_client_company_id(): string {
        return this._project_client_company_id;
    }

    public set project_client_company_id(value: string) {
        this._project_client_company_id = value;
    }

    public get project_client_company_name(): string {
        return this._project_client_company_name;
    }

    public set project_client_company_name(value: string) {
        this._project_client_company_name = value;
    }

};
