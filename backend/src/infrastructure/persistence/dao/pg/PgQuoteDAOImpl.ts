import { type Pool }          from 'pg';
import { type QuotePO }      from '../../po/QuotePO.js';
import { type QuoteDAO }     from '../QuoteDAO.js';
import { type QuoteStatuses } from '../../../../domain/enums/QuoteStatuses.js';


export class PgQuoteDAOImpl implements QuoteDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<QuotePO[]> {

        const { rows } = await this.pool.query('SELECT * FROM quotes');

        return rows;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<QuotePO[]> {

        const params: unknown[] = [ workspaceId ];
        let query = 'SELECT * FROM quotes WHERE workspace_id = $1 ORDER BY issue_date DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findById(id: string): Promise<QuotePO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM quotes WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByIds(ids: string[]): Promise<QuotePO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM quotes WHERE id = ANY($1)',
            [ ids ]
        );

        return rows;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<QuotePO[]> {

        const params: unknown[] = [ workspaceId, clientId ];
        let query = 'SELECT * FROM quotes WHERE workspace_id = $1 AND client_id = $2 ORDER BY issue_date DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async save(entity: QuotePO): Promise<QuotePO> {

        const { rows } = await this.pool.query(
            `INSERT INTO quotes (
                id, workspace_id, client_id, number, status,
                issue_date, expires_at, notes, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) ON CONFLICT (id) DO UPDATE SET
                client_id  = EXCLUDED.client_id,
                number     = EXCLUDED.number,
                status     = EXCLUDED.status,
                issue_date = EXCLUDED.issue_date,
                expires_at = EXCLUDED.expires_at,
                notes      = EXCLUDED.notes,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [
                entity.id, entity.workspace_id, entity.client_id, entity.number, entity.status,
                entity.issue_date, entity.expires_at, entity.notes, entity.created_at, entity.updated_at
            ]
        );

        return rows[0];

    };

    public async updateStatus(quoteId: string, status: QuoteStatuses): Promise<QuotePO> {

        const { rows } = await this.pool.query(
            'UPDATE quotes SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [ status, quoteId ]
        );

        return rows[0];

    };

    public async delete(entity: QuotePO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM quotes WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
