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
import type { TeamMemberRoles } from "../enums/TeamMemberRoles.js";


export interface ITeamMember {

    id:        string;
    workspace: IWorkspace;
    userId:    string;
    role:      TeamMemberRoles;
    createdAt: Date;
    updatedAt: Date;

};

export class TeamMember implements ITeamMember {

    private _id:        string;
    private _workspace: Workspace;
    private _userId:    string;
    private _role:      TeamMemberRoles;
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

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        this._userId = value;
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

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

};