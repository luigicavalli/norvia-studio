import type { Client }                from "../../../domain/model/Client.js";
import type { ClientPO }              from "../po/ClientPO.js";
import type { ClientDAO }             from "../dao/ClientDAO.js";
import { ClientPOConverter }          from "../converter/ClientPOConverter.js";
import type { ClientRepository }      from "../../../domain/repositories/ClientRepository.js";
import type { IPersistenceConverter } from "../converter/IPersistenceConverter.js";


export class ClientRepositoryImpl implements ClientRepository {

    private readonly clientConverter: IPersistenceConverter<ClientPO, Client> = new ClientPOConverter();

    public constructor(private readonly dao: ClientDAO) {}

    public async findAll(limit?: number, offset?: number): Promise<Client[]> {

        const records: ClientPO[] = await this.dao.findAll(limit, offset);

        return records.map((r) => this.clientConverter.toBO(r));

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<Client[]> {

        const records: ClientPO[] = await this.dao.findByWorkspace(workspaceId, limit, offset);

        return records.map((r) => this.clientConverter.toBO(r));

    };

    public async findById(id: string): Promise<Client | null> {

        const record: ClientPO | null = await this.dao.findById(id);

        return record ? this.clientConverter.toBO(record) : null;

    };

    public async findByCompany(workspaceId: string, companyId: string, limit?: number, offset?: number): Promise<Client[]> {

        const records: ClientPO[] = await this.dao.findByCompany(workspaceId, companyId, limit, offset);

        return records.map((r) => this.clientConverter.toBO(r));

    };

    public async findByEmail(workspaceId: string, email: string): Promise<Client | null> {

        const record: ClientPO | null = await this.dao.findByEmail(workspaceId, email);

        return record ? this.clientConverter.toBO(record) : null;

    };

    public async save(entity: Client): Promise<Client> {

        const record: ClientPO = await this.dao.save(this.clientConverter.toPO(entity));

        return this.clientConverter.toBO(record);

    };

    public async delete(entity: Client): Promise<boolean> {

        return this.dao.delete(this.clientConverter.toPO(entity));

    };

};
