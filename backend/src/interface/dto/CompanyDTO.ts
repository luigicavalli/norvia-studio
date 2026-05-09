export interface CompanyDTO {

    id:          string;
    workspaceId: string;
    name:        string;
    taxCode:     string;
    email:       string;
    phone:       number;
    address:     string;
    city:        string;
    zipCode:     number;
    country:     string;
    website:     string;
    createdAt:   Date;
    updatedAt:   Date;

};