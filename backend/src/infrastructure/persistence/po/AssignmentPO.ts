export class AssignmentPO {

    private _id:             string;
    private _project_id:     string;
    private _team_member_id: string;
    private _created_at:     Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get project_id(): string {
        return this._project_id;
    }

    public set project_id(value: string) {
        this._project_id = value;
    }

    public get team_member_id(): string {
        return this._team_member_id;
    }

    public set team_member_id(value: string) {
        this._team_member_id = value;
    }

    public get created_at(): Date {
        return this._created_at;
    }

    public set created_at(value: Date) {
        this._created_at = value;
    }

};
