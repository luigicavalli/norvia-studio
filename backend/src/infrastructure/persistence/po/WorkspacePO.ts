export class WorkspacePO {

    private _id:          string;
    private _name:        string;
    private _slug:        string;
    private _description: string | null = null;
    private _created_at:  Date;
    private _updated_at:  Date;

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

    public get created_at(): Date {
        return this._created_at;
    }

    public set created_at(value: Date) {
        this._created_at = value;
    }

    public get description(): string | null {
        return this._description;
    }

    public set description(value: string | null) {
        this._description = value;
    }

    public get updated_at(): Date {
        return this._updated_at;
    }

    public set updated_at(value: Date) {
        this._updated_at = value;
    }

};
