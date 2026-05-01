/**
 * --------
 * ENTITIES
 * --------
 */
import type { IQuote, Quote }           from "./Quote.js";
import type { IBudget, Budget }         from "./Budget.js";
import type { IClient, Client }         from "./Client.js";
import type { IWorkspace, Workspace }   from "./Workspace.js";
import type { IAssignment, Assignment } from "./Assignment.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { ProjectStatuses }   from "../enums/ProjectStatuses.js";
import type { ProjectPriorities } from "../enums/ProjectPriorities.js";


export interface IProject {

    id:          string;
    name:        string;
    description: string;
    workspace:   IWorkspace;
    assignments: IAssignment[];
    client:      IClient;
    status:      ProjectStatuses;
    priority:    ProjectPriorities;
    budget:      IBudget;
    quote:       IQuote | undefined;
    startDate:   Date;
    dueDate:     Date;
    completedAt: Date | undefined;
    createdAt:   Date;
    updatedAt:   Date;

};

export class Project implements IProject {

    private _id:          string;
    private _name:        string;
    private _description: string;
    private _workspace:   Workspace;
    private _assignments: Assignment[];
    private _client:      Client;
    private _status:      ProjectStatuses;
    private _priority:    ProjectPriorities;
    private _budget:      Budget;
    private _quote:       Quote | undefined;
    private _startDate:   Date;
    private _dueDate:     Date;
    private _completedAt: Date | undefined;
    private _createdAt:   Date;
    private _updatedAt:   Date;

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

    public get workspace(): Workspace {
        return this._workspace;
    }

    public set workspace(value: Workspace) {
        this._workspace = value;
    }

    public get assignments(): Assignment[] {
        return this._assignments;
    }

    public set assignments(value: Assignment[]) {
        this._assignments = value;
    }

    public get client(): Client {
        return this._client;
    }

    public set client(value: Client) {
        this._client = value;
    }

    public get status(): ProjectStatuses {
        return this._status;
    }

    public set status(value: ProjectStatuses) {
        this._status = value;
    }

    public get priority(): ProjectPriorities {
        return this._priority;
    }

    public set priority(value: ProjectPriorities) {
        this._priority = value;
    }

    public get budget(): Budget {
        return this._budget;
    }

    public set budget(value: Budget) {
        this._budget = value;
    }

    public get quote(): Quote | undefined {
        return this._quote;
    }

    public set quote(value: Quote | undefined) {
        this._quote = value;
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

    public get completedAt(): Date | undefined {
        return this._completedAt;
    }

    public set completedAt(value: Date | undefined) {
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