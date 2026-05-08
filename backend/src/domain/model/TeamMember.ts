/**
 * --------
 * ENTITIES
 * --------
 */
import type { IWorkspace, Workspace } from "./Workspace.js";

/**
 * ----
 * ENUM
 * ----
 */
import type { TeamMemberRoles }   from "../enums/TeamMemberRoles.js";
import type { TeamMemberStatuses } from "../enums/TeamMemberStatuses.js";


export interface ITeamMember {

    id:        string;
    workspace: IWorkspace;
    userId:    string | null;
    email:     string | null;
    firstName: string | null;
    lastName:  string | null;
    role:      TeamMemberRoles;
    status:    TeamMemberStatuses;
    createdAt: Date;
    updatedAt: Date;

};

export class TeamMember implements ITeamMember {

    private _id:        string;
    private _workspace: Workspace;
    private _userId:    string | null;
    private _email:     string | null;
    private _firstName: string | null;
    private _lastName:  string | null;
    private _role:      TeamMemberRoles;
    private _status:    TeamMemberStatuses;
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

    public get userId(): string | null {
        return this._userId;
    }

    public set userId(value: string | null) {
        this._userId = value;
    }

    public get email(): string | null {
        return this._email;
    }

    public set email(value: string | null) {
        this._email = value;
    }

    public get firstName(): string | null {
        return this._firstName;
    }

    public set firstName(value: string | null) {
        this._firstName = value;
    }

    public get lastName(): string | null {
        return this._lastName;
    }

    public set lastName(value: string | null) {
        this._lastName = value;
    }

    public get role(): TeamMemberRoles {
        return this._role;
    }

    public set role(value: TeamMemberRoles) {
        this._role = value;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    public get status(): TeamMemberStatuses {
        return this._status;
    }

    public set status(value: TeamMemberStatuses) {
        this._status = value;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

};