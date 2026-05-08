export class TeamMemberPO {

    private _id:           string;
    private _workspace_id: string;
    private _user_id:      string | null;
    private _email:        string | null;
    private _role:         string;
    private _status:       string;
    private _created_at:   Date;
    private _updated_at:   Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get workspace_id(): string {
        return this._workspace_id;
    }

    public set workspace_id(value: string) {
        this._workspace_id = value;
    }

    public get user_id(): string | null {
        return this._user_id;
    }

    public set user_id(value: string | null) {
        this._user_id = value;
    }

    public get email(): string | null {
        return this._email;
    }

    public set email(value: string | null) {
        this._email = value;
    }

    public get role(): string {
        return this._role;
    }

    public set role(value: string) {
        this._role = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
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

};
