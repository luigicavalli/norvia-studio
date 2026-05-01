import type { ClientDTO } from "./ClientDTO.js";

export interface ProjectDTO {

    id:             string;
    workspaceId:    string;
    name:           string;
    description:    string;
    client:         ClientDTO;
    status:         string;
    priority:       string;
    budgetAmount:   number;
    budgetCurrency: string;
    startDate:      Date;
    dueDate:        Date;
    completedAt:    Date | null;
    createdAt:      Date;
    updatedAt:      Date;

};