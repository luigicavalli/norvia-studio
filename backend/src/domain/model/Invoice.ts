/**
 * --------
 * ENTITIES
 * --------
 */
import type { IClient, Client }       from "./Client.js";
import type { IProject, Project }     from "./Project.js";
import type { IWorkspace, Workspace } from "./Workspace.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { InvoiceStatus } from "../enums/InvoiceStatus.js";


export interface IInvoice {

    id:        string;
    workspace: IWorkspace;
    client:    IClient;
    project:   IProject | undefined;
    number:    number;
    status:    InvoiceStatus;
    issueDate: Date;
    dueDate:   Date;
    paidAt:    Date | undefined;
    notes:     string;
    createdAt: Date;
    updatedAt: Date;

};

export class Invoice implements IInvoice {
    
    private _id:        string;
    private _workspace: Workspace;
    private _client:    Client;
    private _project:   Project | undefined;
    private _number:    number;
    private _status:    InvoiceStatus;
    private _issueDate: Date;
    private _dueDate:   Date;
    private _paidAt:    Date | undefined;
    private _notes:     string;
    private _createdAt: Date;
    private _updatedAt: Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get workspace(): Workspace {
        return this._workspace;
    }

    public set workspace(value: Workspace) {
        this._workspace = value;
    }

    public get client(): Client {
        return this._client;
    }

    public set client(value: Client) {
        this._client = value;
    }

    public get project(): Project | undefined {
        return this._project;
    }

    public set project(value: Project | undefined) {
        this._project = value;
    }

    public get number(): number {
        return this._number;
    }

    public set number(value: number) {
        this._number = value;
    }

    public get status(): InvoiceStatus {
        return this._status;
    }

    public set status(value: InvoiceStatus) {
        this._status = value;
    }

    public get issueDate(): Date {
        return this._issueDate;
    }

    public set issueDate(value: Date) {
        this._issueDate = value;
    }

    public get dueDate(): Date {
        return this._dueDate;
    }

    public set dueDate(value: Date) {
        this._dueDate = value;
    }

    public get paidAt(): Date | undefined {
        return this._paidAt;
    }

    public set paidAt(value: Date | undefined) {
        this._paidAt = value;
    }

    public get notes(): string {
        return this._notes;
    }

    public set notes(value: string) {
        this._notes = value;
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