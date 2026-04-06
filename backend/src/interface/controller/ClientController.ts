import { Client }                          from "../../domain/model/Client.js";
import type { ClientDTO }                  from "../dto/ClientDTO.js";
import { ClientDTOConverter }              from "../converter/ClientDTOConverter.js";
import type { IDTOConverter }              from "../converter/IDTOConverter.js";
import type { CreateClientUseCase }        from "../../application/use-case/CreateClientUseCase.js";
import type { DeleteClientUseCase }        from "../../application/use-case/DeleteClientUseCase.js";
import type { UpdateClientUseCase }        from "../../application/use-case/UpdateClientUseCase.js";
import type { GetAllClientsUseCase }       from "../../application/use-case/GetAllClientsUseCase.js";
import type { GetClientByIdUseCase }       from "../../application/use-case/GetClientByIdUseCase.js";
import type { GetClientsByCompanyUseCase } from "../../application/use-case/GetClientsByCompanyUseCase.js";


export class ClientController {

    private readonly converter: IDTOConverter<ClientDTO, Client> = new ClientDTOConverter();

    public constructor(
        private readonly getAllClientsUC:       GetAllClientsUseCase,
        private readonly getClientsByCompanyUC: GetClientsByCompanyUseCase,
        private readonly getClientByIdUC:       GetClientByIdUseCase,
        private readonly createClientUC:        CreateClientUseCase,
        private readonly updateClientUC:        UpdateClientUseCase,
        private readonly deleteClientUC:        DeleteClientUseCase
    ) {}

    public async getAll(workspaceId: string, userId: string, limit?: number, offset?: number): Promise<ClientDTO[]> {

        const clientDTOs: ClientDTO[] = [];

        const records: Client[] = await this.getAllClientsUC.execute({ workspaceId, userId, limit, offset });

        records.forEach((record: Client) => {
            const clientDTO: ClientDTO = this.converter.toDTO(record);

            clientDTOs.push(clientDTO);
        });

        return clientDTOs;

    };

    public async getByCompany(workspaceId: string, companyId: string, userId: string, limit?: number, offset?: number): Promise<ClientDTO[]> {

        const clientDTOs: ClientDTO[] = [];

        const records: Client[] = await this.getClientsByCompanyUC.execute({ workspaceId, companyId, userId, limit, offset });

        records.forEach((record: Client) => {
            const clientDTO: ClientDTO = this.converter.toDTO(record);

            clientDTOs.push(clientDTO);
        });

        return clientDTOs;

    };

    public async getById(id: string): Promise<ClientDTO | null> {

        const record: Client | null = await this.getClientByIdUC.execute(id);
        
        if (!record) {
            return null;
        }

        const companyDTO: ClientDTO = this.converter.toDTO(record);

        return companyDTO;

    };

    public async save(clientDTO: ClientDTO): Promise<void> {

        const client: Client = this.converter.toBO(clientDTO);
        
        await this.createClientUC.execute(client);

    };

    public async update(clientDTO: ClientDTO): Promise<void> {

        const client: Client = this.converter.toBO(clientDTO);
        
        await this.updateClientUC.execute(client);

    };

    public async delete(id: string): Promise<void> {

        const client = new Client();
        client.id = id;

        await this.deleteClientUC.execute(client);

    };

};