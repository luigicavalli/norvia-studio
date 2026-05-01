/**
 * --------
 * ENTITIES
 * --------
 */
import type { ICompany, Company }     from "./Company.js";
import type { IWorkspace, Workspace } from "./Workspace.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { ClientStatuses } from "../enums/ClientStatuses.js";


export interface IClient {

    id:          string;
    workspace:   IWorkspace;
    firstName:   string;
    lastName:    string;
    email:       string;
    phone:       number;
    company:     ICompany;
    vatNumber:   string;
    status:      ClientStatuses;
    notes:       string;
    createdAt:   Date;
    updatedAt:   Date;

};

export class Client implements IClient {

    private _id:          string;
    private _workspace:   Workspace;
    private _firstName:   string;
    private _lastName:    string;
    private _email:       string;
    private _phone:       number;
    private _company:     Company;
    private _vatNumber:   string;
    private _status:      ClientStatuses;
    private _notes:       string;
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

    public get workspace(): Workspace {
        return this._workspace;
    }

    public set workspace(value: Workspace) {
        this._workspace = value;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(value: string) {
        this._lastName = value;
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

    public get company(): Company {
        return this._company;
    }

    public set company(value: Company) {
        this._company = value;
    }

    public get vatNumber(): string {
        return this._vatNumber;
    }

    public set vatNumber(value: string) {
        this._vatNumber = value;
    }

    public get status(): ClientStatuses {
        return this._status;
    }

    public set status(value: ClientStatuses) {
        this._status = value;
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