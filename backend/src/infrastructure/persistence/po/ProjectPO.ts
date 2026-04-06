export class ProjectPO {

    private _id:              string;
    private _workspace_id:    string;
    private _name:            string;
    private _description:     string;
    private _client_id:       string;
    private _quote_id:        string | null;
    private _status:          string;
    private _priority:        string;
    private _budget_amount:   number;
    private _budget_currency: string;
    private _start_date:      Date;
    private _due_date:        Date;
    private _completed_at:    Date | null;
    private _created_at:      Date;
    private _updated_at:      Date;

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

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get client_id(): string {
        return this._client_id;
    }

    public set client_id(value: string) {
        this._client_id = value;
    }

    public get quote_id(): string | null {
        return this._quote_id;
    }

    public set quote_id(value: string | null) {
        this._quote_id = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
    }

    public get priority(): string {
        return this._priority;
    }

    public set priority(value: string) {
        this._priority = value;
    }

    public get budget_amount(): number {
        return this._budget_amount;
    }

    public set budget_amount(value: number) {
        this._budget_amount = value;
    }

    public get budget_currency(): string {
        return this._budget_currency;
    }

    public set budget_currency(value: string) {
        this._budget_currency = value;
    }

    public get start_date(): Date {
        return this._start_date;
    }

    public set start_date(value: Date) {
        this._start_date = value;
    }

    public get due_date(): Date {
        return this._due_date;
    }

    public set due_date(value: Date) {
        this._due_date = value;
    }

    public get completed_at(): Date | null {
        return this._completed_at;
    }

    public set completed_at(value: Date | null) {
        this._completed_at = value;
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