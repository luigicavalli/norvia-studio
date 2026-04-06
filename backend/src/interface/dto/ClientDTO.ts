import type { CompanyDTO } from "./CompanyDTO.js";

export interface ClientDTO {

    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
    phone:      number;
    company:    CompanyDTO;
    vatNumber:  string;
    status:     string;
    notes:      string;
    createdAt:  Date;
    updatedAt:  Date;

};