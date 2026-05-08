export interface TeamMemberDTO {

    id:          string;
    workspaceId: string;
    userId:      string | null;
    email:       string | null;
    firstName:   string | null;
    lastName:    string | null;
    role:        string;
    status:      string;
    createdAt:   Date;
    updatedAt:   Date;

};
