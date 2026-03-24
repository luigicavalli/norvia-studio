import type { CompanyDTO, ICompanyDTO } from "./CompanyDTO.js";

export interface IClientDTO {

    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
    phone:      number;
    company:    ICompanyDTO;
    vatNumber:  string;
    status:     string;
    notes:      string;
    createdAt:  Date;
    updatedAt:  Date;

};

export class ClientDTO implements IClientDTO {

    private _id:         string;
    private _firstName:  string;
    private _lastName:   string;
    private _email:      string;
    private _phone:      number;
    private _company:    CompanyDTO;
    private _vatNumber:  string;
    private _status:     string;
    private _notes:      string;
    private _createdAt:  Date;
    private _updatedAt:  Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
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

    public get company(): CompanyDTO {
        return this._company;
    }

    public set company(value: CompanyDTO) {
        this._company = value;
    }

    public get vatNumber(): string {
        return this._vatNumber;
    }

    public set vatNumber(value: string) {
        this._vatNumber = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
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

    public get fullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }

};