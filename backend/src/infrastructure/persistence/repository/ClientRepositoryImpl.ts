import type { Client }                from "../../../domain/model/Client.js";
import { ClientPOFlat }               from "../po/ClientPOFlat.js";
import type { ClientPO }              from "../po/ClientPO.js";
import type { ClientDAO }             from "../dao/ClientDAO.js";
import { ClientPOConverter }          from "../converter/ClientPOConverter.js";
import { ClientPOFlatConverter }      from "../converter/ClientPOFlatConverter.js";
import type { ClientRepository }      from "../../../domain/repositories/ClientRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class ClientRepositoryImpl implements ClientRepository {

    private readonly converter:     IPersistenceConverter<ClientPO, Client>     = new ClientPOConverter();
    private readonly flatConverter: IPersistenceConverter<ClientPOFlat, Client> = new ClientPOFlatConverter();

    public constructor(private readonly dao: ClientDAO) {}

    public async findAll(limit?: number, offset?: number): Promise<Client[]> {
        
        const clients: Client[] = [];
                
        const records: ClientPOFlat[] = await this.dao.findAll(limit, offset);

        records.forEach((record: ClientPOFlat) => {
            const client: Client = this.flatConverter.toBO(record);

            clients.push(client);
        });

        return clients;

    };

    public async findByCompany(companyId: string, limit?: number, offset?: number): Promise<Client[]> {

        const clients: Client[] = [];
                
        const records: ClientPOFlat[] = await this.dao.findByCompany(companyId, limit, offset);

        records.forEach((record: ClientPOFlat) => {
            const client: Client = this.flatConverter.toBO(record);

            clients.push(client);
        });

        return clients;
        
    };

    public async findByEmail(email: string): Promise<Client | null> {

        const record: ClientPOFlat | null = await this.dao.findByEmail(email);
        
        if (!record) {
            return null;
        }

        const client: Client = this.flatConverter.toBO(record);

        return client;

    };

    public async findById(id: string): Promise<Client | null> {
        
        const record: ClientPOFlat | null = await this.dao.findById(id);
        
        if (!record) {
            return null;
        }

        const client: Client = this.flatConverter.toBO(record);

        return client;
        
    };

    public async save(entity: Client): Promise<Client> {

        const clientPO: ClientPO = this.converter.toPO(entity);
        
        const record: ClientPO = await this.dao.save(clientPO);

        const createdClient: Client = this.converter.toBO(record);

        return createdClient;

    };

    public async delete(entity: Client): Promise<boolean> {
        
        const clientPO: ClientPO = this.converter.toPO(entity);
        
        const success: boolean = await this.dao.delete(clientPO);

        return success ? true : false;
        
    };
    
};