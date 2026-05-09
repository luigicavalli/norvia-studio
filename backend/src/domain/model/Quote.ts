/**
 * --------
 * ENTITIES
 * --------
 */
import type { IClient, Client }         from "./Client.js";
import type { IWorkspace, Workspace }   from "./Workspace.js";
import type { IQuoteItem, QuoteItem }   from "./QuoteItem.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { QuoteStatuses } from "../enums/QuoteStatuses.js";


export interface IQuote {

    id:        string;
    workspace: IWorkspace;
    client:    IClient;
    items:     IQuoteItem[];
    number:    number;
    status:    QuoteStatuses;
    issueDate: Date;
    expiresAt: Date;
    notes:     string;
    createdAt: Date;
    updatedAt: Date;

};

export class Quote implements IQuote {

    private _id:        string;
    private _workspace: Workspace;
    private _client:    Client;
    private _items:     QuoteItem[] = [];
    private _number:    number;
    private _status:    QuoteStatuses;
    private _issueDate: Date;
    private _expiresAt: Date;
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

    public get items(): QuoteItem[] {
        return this._items;
    }

    public set items(value: QuoteItem[]) {
        this._items = value;
    }

    public get number(): number {
        return this._number;
    }

    public set number(value: number) {
        this._number = value;
    }

    public get status(): QuoteStatuses {
        return this._status;
    }

    public set status(value: QuoteStatuses) {
        this._status = value;
    }

    public get issueDate(): Date {
        return this._issueDate;
    }

    public set issueDate(value: Date) {
        this._issueDate = value;
    }

    public get expiresAt(): Date {
        return this._expiresAt;
    }

    public set expiresAt(value: Date) {
        this._expiresAt = value;
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