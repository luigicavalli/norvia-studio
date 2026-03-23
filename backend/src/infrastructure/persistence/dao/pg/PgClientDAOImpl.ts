import { type Pool }      from 'pg';
import { ClientPOFlat }   from '../../po/ClientPOFlat.js';
import { type ClientPO }  from '../../po/ClientPO.js';
import { type ClientDAO } from '../ClientDAO.js';


export class PgClientDAOImpl implements ClientDAO {

    public constructor(private readonly pool: Pool) {}

    public async findById(id: string): Promise<ClientPOFlat | null> {

        let client: ClientPOFlat = new ClientPOFlat();

        const { rows } = await this.pool.query(
            'SELECT * FROM clients_flat WHERE client_id = $1',
            [ id ]
        );

        client = rows[0];

        return client ?? null;

    };

    public async findAll(): Promise<ClientPOFlat[]> {

        let clients: ClientPOFlat[] = [];

        const { rows } = await this.pool.query('SELECT * FROM clients_flat');

        clients = rows;

        return clients ?? [];

    };

    public async findByEmail(email: string): Promise<ClientPOFlat | null> {

        let client: ClientPOFlat = new ClientPOFlat();

        const { rows } = await this.pool.query(
            'SELECT * FROM clients_flat WHERE client_email = $1',
            [ email ]
        );

        client = rows[0];

        return client ?? null;

    };

    public async findByCompany(companyId: string): Promise<ClientPOFlat[]> {

        let clients: ClientPOFlat[] = [];

        const { rows } = await this.pool.query(
            'SELECT * FROM clients_flat WHERE client_company_id = $1',
            [ companyId ]
        );

        clients = rows;

        return clients;

    };

    public async save(client: ClientPO): Promise<ClientPO> {

        let clientFlattened = client.flatten() as ClientPO;

        const values = [
            clientFlattened.first_name,
            clientFlattened.last_name,
            clientFlattened.email,
            clientFlattened.phone,
            clientFlattened.company,
            clientFlattened.vat_number,
            clientFlattened.status,
            clientFlattened.notes
        ];

        const { rows } = await this.pool.query(
            `INSERT INTO clients (
                first_name, last_name, email,
                phone, company, vat_number,
                status, notes
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8
            ) RETURNING *`, values
        );

        const createdClient: ClientPO = rows[0];

        return createdClient;

    };

    public async delete(client: ClientPO): Promise<boolean> {
        
        const { rows } = await this.pool.query(
            `DELETE FROM clients WHERE id = $1 RETURNING id`,
            [ client.id ]
        );

        if (rows[0] !== client.id) {
            return false;
        }

        return true;

    };

};
