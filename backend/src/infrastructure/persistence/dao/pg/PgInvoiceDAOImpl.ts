import { type Pool }          from 'pg';
import { type InvoicePO }    from '../../po/InvoicePO.js';
import { type InvoiceDAO }   from '../InvoiceDAO.js';
import { type InvoiceStatus } from '../../../../domain/enums/InvoiceStatus.js';


export class PgInvoiceDAOImpl implements InvoiceDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<InvoicePO[]> {

        const { rows } = await this.pool.query('SELECT * FROM invoices');

        return rows;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<InvoicePO[]> {

        const params: unknown[] = [ workspaceId ];
        let query = 'SELECT * FROM invoices WHERE workspace_id = $1 ORDER BY issue_date DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findById(id: string): Promise<InvoicePO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM invoices WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<InvoicePO[]> {

        const params: unknown[] = [ workspaceId, clientId ];
        let query = 'SELECT * FROM invoices WHERE workspace_id = $1 AND client_id = $2 ORDER BY issue_date DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByProject(projectId: string): Promise<InvoicePO[]> {

        const { rows } = await this.pool.query(
            'SELECT * FROM invoices WHERE project_id = $1 ORDER BY issue_date DESC',
            [ projectId ]
        );

        return rows;

    };

    public async save(entity: InvoicePO): Promise<InvoicePO> {

        const { rows } = await this.pool.query(
            `INSERT INTO invoices (
                id, workspace_id, client_id, project_id, number,
                status, issue_date, due_date, paid_at, notes,
                created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) ON CONFLICT (id) DO UPDATE SET
                client_id  = EXCLUDED.client_id,
                project_id = EXCLUDED.project_id,
                number     = EXCLUDED.number,
                status     = EXCLUDED.status,
                issue_date = EXCLUDED.issue_date,
                due_date   = EXCLUDED.due_date,
                paid_at    = EXCLUDED.paid_at,
                notes      = EXCLUDED.notes,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
            [
                entity.id, entity.workspace_id, entity.client_id, entity.project_id, entity.number,
                entity.status, entity.issue_date, entity.due_date, entity.paid_at, entity.notes,
                entity.created_at, entity.updated_at
            ]
        );

        return rows[0];

    };

    public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<InvoicePO> {

        const paidAt = status === 'PAID' ? 'NOW()' : 'NULL';

        const { rows } = await this.pool.query(
            `UPDATE invoices SET status = $1, paid_at = ${paidAt}, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [ status, invoiceId ]
        );

        return rows[0];

    };

    public async delete(entity: InvoicePO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM invoices WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
