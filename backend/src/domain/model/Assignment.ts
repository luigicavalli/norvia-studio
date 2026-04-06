/**
 * --------
 * ENTITIES
 * --------
 */
import type { IProject, Project }       from "./Project.js";
import type { ITeamMember, TeamMember } from "./TeamMember.js";


export interface IAssignment {

    id:         string;
    project:    IProject;
    teamMember: ITeamMember;
    createdAt:  Date;

};

export class Assignment implements IAssignment {

    private _id:         string;
    private _project:    Project;
    private _teamMember: TeamMember;
    private _createdAt:  Date;

    /* ***************
     * Getter & Setter
     */

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get project(): Project {
        return this._project;
    }

    public set project(value: Project) {
        this._project = value;
    }

    public get teamMember(): TeamMember {
        return this._teamMember;
    }

    public set teamMember(value: TeamMember) {
        this._teamMember = value;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

};