import type { Client }      from "../model/Client.js";
import type { IRepository } from "./IRepository.js";

export interface ClientRepository extends IRepository<string, Client> {

    findAll(limit?: number, offset?: number): Promise<Client[]>;

    findByCompany(companyId: string, limit?: number, offset?: number): Promise<Client[]>;

    findByEmail(email: string): Promise<Client | null>;

};