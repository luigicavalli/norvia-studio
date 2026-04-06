export interface IWorkspace {

    id:        string;
    name:      string;
    slug:      string;
    createdAt: Date;
    updatedAt: Date;
    
};

export class Workspace implements IWorkspace {

    private _id:        string;
    private _name:      string;
    private _slug:      string;
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

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get slug(): string {
        return this._slug;
    }

    public set slug(value: string) {
        this._slug = value;
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