import type { Client }           from "../../domain/model/Client.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


interface GetClientsByCompanyInput {
    companyId: string;
    limit?:    number;
    offset?:   number;
}

export class GetClientsByCompanyUseCase implements IUseCase<GetClientsByCompanyInput, Client[]> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: GetClientsByCompanyInput): Promise<Client[]> {

        const companyId: string = input.companyId;

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;
        
        const clients: Client[] = await this.clientRepository.findByCompany(companyId, limit, offset);

        return clients;

    }

}