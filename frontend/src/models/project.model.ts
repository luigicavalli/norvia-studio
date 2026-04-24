import type { Client } from './client.model';

export type ProjectStatus   = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'UNKNOWN';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export interface Project {
  id:             string;
  name:           string;
  description:    string;
  clientId:       string;
  clientName:     string;
  status:         ProjectStatus;
  priority:       ProjectPriority;
  budgetAmount:   number | null;
  budgetCurrency: string;
  startDate:      Date | null;
  dueDate:        Date | null;
  completedAt:    Date | null;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface SaveProjectData {
  name:           string;
  description:    string;
  client:         Client;
  status:         ProjectStatus;
  priority:       ProjectPriority;
  budgetAmount:   number | null;
  budgetCurrency: string;
  startDate:      Date | null;
  dueDate:        Date | null;
}
