import type { ClientPO, IClientPO } from "./ClientPO.js";

export interface IProjectPO {
    
    id:              string;
    name:            string;
    description:     string;
    client:          IClientPO;
    status:          string;
    priority:        string;
    budget_amount:   number;
    budget_currency: string;
    start_date:      Date;
    due_date:        Date;
    completed_at:    Date;
    created_at:      Date;
    updated_at:      Date;
    
};

export class ProjectPO implements IProjectPO {

    private _id:              string;
    private _name:            string;
    private _description:     string;
    private _client:          ClientPO;
    private _status:          string;
    private _priority:        string;
    private _budget_amount:   number;
    private _budget_currency: string;
    private _start_date:      Date;
    private _due_date:        Date;
    private _completed_at:    Date;
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

    public get client(): ClientPO {
        return this._client;
    }

    public set client(value: ClientPO) {
        this._client = value;
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

    public get completed_at(): Date {
        return this._completed_at;
    }

    public set completed_at(value: Date) {
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

    public flatten(): any {
        return {
            id:              this.id,
            name:            this.name,
            description:     this.description,
            client:          this.client.id,
            status:          this.status,
            priority:        this.priority,
            budget_amount:   this.budget_amount,
            budget_currency: this.budget_currency,
            start_date:      this.start_date,
            due_date:        this.due_date,
            completed_at:    this.completed_at,
            created_at:      this.created_at,
            updated_at:      this.updated_at
        };
    }

};