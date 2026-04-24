export interface Workspace {
  id:          string;
  name:        string;
  slug:        string;
  description: string | null;
  createdAt:   Date;
  updatedAt:   Date;
}
