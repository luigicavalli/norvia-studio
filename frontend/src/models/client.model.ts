export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'UNKNOWN';

export interface Client {
  id:          string;
  firstName:   string;
  lastName:    string;
  fullName:    string;
  email:       string;
  phone:       string;
  companyId:   string | null;
  companyName: string | null;
  vatNumber:   string;
  status:      ClientStatus;
  notes:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface CreateClientData {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  notes:     string;
  companyId: string | null;
}
