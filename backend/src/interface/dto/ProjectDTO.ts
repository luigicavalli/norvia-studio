import type { ClientDTO, IClientDTO } from "./ClientDTO.js";

export interface IProjectDTO {

    id:             string;
    name:           string;
    description:    string;
    client:         IClientDTO;
    status:         string;
    priority:       string;
    budgetAmount:   number;
    budgetCurrency: string;
    startDate:      Date;
    dueDate:        Date;
    completedAt:    Date;
    createdAt:      Date;
    updatedAt:      Date;

};

export class ProjectDTO implements IProjectDTO {

    private _id:             string;
    private _name:           string;
    private _description:    string;
    private _client:         ClientDTO;
    private _status:         string;
    private _priority:       string;
    private _budgetAmount:   number;
    private _budgetCurrency: string;
    private _startDate:      Date;
    private _dueDate:        Date;
    private _completedAt:    Date;
    private _createdAt:      Date;
    private _updatedAt:      Date;


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

    public get client(): ClientDTO {
        return this._client;
    }

    public set client(value: ClientDTO) {
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

    public get budgetAmount(): number {
        return this._budgetAmount;
    }

    public set budgetAmount(value: number) {
        this._budgetAmount = value;
    }

    public get budgetCurrency(): string {
        return this._budgetCurrency;
    }

    public set budgetCurrency(value: string) {
        this._budgetCurrency = value;
    }

    public get startDate(): Date {
        return this._startDate;
    }

    public set startDate(value: Date) {
        this._startDate = value;
    }

    public get dueDate(): Date {
        return this._dueDate;
    }

    public set dueDate(value: Date) {
        this._dueDate = value;
    }

    public get completedAt(): Date {
        return this._completedAt;
    }

    public set completedAt(value: Date) {
        this._completedAt = value;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

};