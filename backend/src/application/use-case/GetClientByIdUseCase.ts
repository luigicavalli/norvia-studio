import type { Client }           from "../../domain/model/Client.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


export class GetClientByIdUseCase implements IUseCase<string, Client> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: string): Promise<Client> {
        
        const client: Client | null = await this.clientRepository.findById(input);

        if (!client) {
            throw new Error()
        }

        return client;

    }

}