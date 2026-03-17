import type { Client }           from "../../domain/model/Client.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


interface GetAllClientsInput {
    limit?:  number,
    offset?: number
}

export class GetAllClientsUseCase implements IUseCase<GetAllClientsInput, Client[]> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: GetAllClientsInput): Promise<Client[]> {

        const limit:  number | undefined = input.limit;
        const offset: number | undefined = input.offset;
        
        const clients: Client[] = await this.clientRepository.findAll(limit, offset);

        return clients;

    }

}