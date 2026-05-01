export class QuotePO {

    private _id:           string;
    private _workspace_id: string;
    private _client_id:    string;
    private _number:       number;
    private _status:       string;
    private _issue_date:   Date;
    private _expires_at:   Date;
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

    public get client_id(): string {
        return this._client_id;
    }

    public set client_id(value: string) {
        this._client_id = value;
    }

    public get number(): number {
        return this._number;
    }

    public set number(value: number) {
        this._number = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
    }

    public get issue_date(): Date {
        return this._issue_date;
    }

    public set issue_date(value: Date) {
        this._issue_date = value;
    }

    public get expires_at(): Date {
        return this._expires_at;
    }

    public set expires_at(value: Date) {
        this._expires_at = value;
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
