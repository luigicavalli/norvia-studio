import { AppErrors }             from "../error/AppError.js";
import type { Client }           from "../../domain/model/Client.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


export class CreateClientUseCase implements IUseCase<Client, Client> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: Client): Promise<Client> {

        const existingClient: Client | null = await this.clientRepository.findByEmail(input.workspace.id, input.email);

        if (existingClient) {
            throw AppErrors.conflict('Client already exists', 'CLIENT_ALREADY_EXISTS');
        }
        
        const createdClient: Client = await this.clientRepository.save(input);

        return createdClient;

    }

}