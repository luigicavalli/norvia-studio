/**
 * --------
 * ENTITIES
 * --------
 */
import type { IWorkspace, Workspace } from "./Workspace.js";


export interface ICompany {

    id:          string;
    name:        string;
    workspace:   IWorkspace;
    taxCode:     string;
    email:       string;
    phone:       number;
    address:     string;
    city:        string;
    zipCode:     number;
    country:     string;
    website:     string;
    createdAt:   Date;
    updatedAt:   Date;

};

export class Company implements ICompany {

    private _id:          string;
    private _name:        string;
    private _workspace:   Workspace;
    private _taxCode:     string;
    private _email:       string;
    private _phone:       number;
    private _address:     string;
    private _city:        string;
    private _zipCode:     number;
    private _country:     string;
    private _website:     string;
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

    public get workspace(): Workspace {
        return this._workspace;
    }

    public set workspace(value: Workspace) {
        this._workspace = value;
    }

    public get taxCode(): string {
        return this._taxCode;
    }

    public set taxCode(value: string) {
        this._taxCode = value;
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

    public get address(): string {
        return this._address;
    }

    public set address(value: string) {
        this._address = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get zipCode(): number {
        return this._zipCode;
    }

    public set zipCode(value: number) {
        this._zipCode = value;
    }

    public get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = value;
    }

    public get website(): string {
        return this._website;
    }

    public set website(value: string) {
        this._website = value;
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