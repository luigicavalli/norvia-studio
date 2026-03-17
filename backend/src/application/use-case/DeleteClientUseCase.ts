import { AppErrors }             from "../error/AppError.js";
import type { IUseCase }         from "./IUseCase.js";
import type { ClientRepository } from "../../domain/repositories/ClientRepository.js";


export class DeleteClientUseCase implements IUseCase<string, boolean> {

    public constructor(private readonly clientRepository: ClientRepository) {}

    public async execute(input: string): Promise<boolean> {
        
        const success: boolean = await this.clientRepository.delete(input);

        if (!success) {
            throw AppErrors.notFound('Cannot update Client', 'CANNOT_UPDATE_CLIENT');
        }

        return success;

    }

}