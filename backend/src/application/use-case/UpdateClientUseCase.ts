import { AppErrors }             from "../error/AppError.js";
import type { Client }           from "../../domain/model/Client.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


export class UpdateClientUseCase implements IUseCase<Client, Client> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: Client): Promise<Client> {

        const existingClient: Client | null = await this.clientRepository.findById(input.id);

        if (!existingClient) {
            throw AppErrors.notFound('Client not found', 'CLIENT_NOT_FOUND');
        }
        
        const updatedClient: Client = await this.clientRepository.save(input);

        return updatedClient;

    }

}