import { type Pool }      from 'pg';
import { type ClientPO }  from '../../po/ClientPO.js';
import { type ClientDAO } from '../ClientDAO.js';


export class PgClientDAOImpl implements ClientDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(limit?: number, offset?: number): Promise<ClientPO[]> {

        const params: unknown[] = [];
        let query = 'SELECT * FROM clients ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ClientPO[]> {

        const params: unknown[] = [ workspaceId ];
        let query = 'SELECT * FROM clients WHERE workspace_id = $1 ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findById(id: string): Promise<ClientPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM clients WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByIds(ids: string[]): Promise<ClientPO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM clients WHERE id = ANY($1)',
            [ ids ]
        );

        return rows;

    };

    public async findByCompany(workspaceId: string, companyId: string, limit?: number, offset?: number): Promise<ClientPO[]> {

        const params: unknown[] = [ workspaceId, companyId ];
        let query = 'SELECT * FROM clients WHERE workspace_id = $1 AND company_id = $2 ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByEmail(workspaceId: string, email: string): Promise<ClientPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM clients WHERE workspace_id = $1 AND email = $2',
            [ workspaceId, email ]
        );

        return rows[0] ?? null;

    };

    public async save(entity: ClientPO): Promise<ClientPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO clients (
                id, workspace_id, first_name, last_name, email,
                phone, company_id, vat_number, status, notes,
                created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) ON CONFLICT (id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name  = EXCLUDED.last_name,
                email      = EXCLUDED.email,
                phone      = EXCLUDED.phone,
                company_id = EXCLUDED.company_id,
                vat_number = EXCLUDED.vat_number,
                status     = EXCLUDED.status,
                notes      = EXCLUDED.notes,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [
                entity.id, entity.workspace_id, entity.first_name, entity.last_name, entity.email,
                entity.phone, entity.company_id, entity.vat_number, entity.status, entity.notes,
                entity.created_at, entity.updated_at
            ]
        );

        return rows[0];

    };

    public async delete(entity: ClientPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM clients WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
