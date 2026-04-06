import { type Pool }            from 'pg';
import { type ProjectPO }       from '../../po/ProjectPO.js';
import { type ProjectDAO }      from '../ProjectDAO.js';
import { type ProjectStatuses } from '../../../../domain/enums/ProjectStatuses.js';


export class PgProjectDAOImpl implements ProjectDAO {

    public constructor(private readonly pool: Pool) {}

    public async findAll(limit?: number, offset?: number): Promise<ProjectPO[]> {

        const params: unknown[] = [];
        let query = 'SELECT * FROM projects ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByWorkspace(workspaceId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        const params: unknown[] = [ workspaceId ];
        let query = 'SELECT * FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findById(id: string): Promise<ProjectPO | null> {

        const { rows } = await this.pool.query(
            'SELECT * FROM projects WHERE id = $1',
            [ id ]
        );

        return rows[0] ?? null;

    };

    public async findByClient(workspaceId: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        const params: unknown[] = [ workspaceId, clientId ];
        let query = 'SELECT * FROM projects WHERE workspace_id = $1 AND client_id = $2 ORDER BY created_at DESC';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async findByNameAndClient(workspaceId: string, projectName: string, clientId: string, limit?: number, offset?: number): Promise<ProjectPO[]> {

        const params: unknown[] = [ workspaceId, projectName, clientId ];
        let query = 'SELECT * FROM projects WHERE workspace_id = $1 AND name = $2 AND client_id = $3';

        if (limit  !== undefined) { params.push(limit);  query += ` LIMIT $${params.length}`;  }
        if (offset !== undefined) { params.push(offset); query += ` OFFSET $${params.length}`; }

        const { rows } = await this.pool.query(query, params);

        return rows;

    };

    public async save(entity: ProjectPO): Promise<ProjectPO> {

        const { rows } = await this.pool.query(
            `INSERT INTO projects (
                id, workspace_id, name, description, client_id,
                quote_id, status, priority, budget_amount, budget_currency,
                start_date, due_date, completed_at, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            ) ON CONFLICT (id) DO UPDATE SET
                name            = EXCLUDED.name,
                description     = EXCLUDED.description,
                client_id       = EXCLUDED.client_id,
                quote_id        = EXCLUDED.quote_id,
                status          = EXCLUDED.status,
                priority        = EXCLUDED.priority,
                budget_amount   = EXCLUDED.budget_amount,
                budget_currency = EXCLUDED.budget_currency,
                start_date      = EXCLUDED.start_date,
                due_date        = EXCLUDED.due_date,
                completed_at    = EXCLUDED.completed_at,
                updated_at      = EXCLUDED.updated_at
            RETURNING *`,
            [
                entity.id, entity.workspace_id, entity.name, entity.description, entity.client_id,
                entity.quote_id, entity.status, entity.priority, entity.budget_amount, entity.budget_currency,
                entity.start_date, entity.due_date, entity.completed_at, entity.created_at, entity.updated_at
            ]
        );

        return rows[0];

    };

    public async updateStatus(projectId: string, status: ProjectStatuses): Promise<ProjectPO> {

        const { rows } = await this.pool.query(
            'UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [ status, projectId ]
        );

        return rows[0];

    };

    public async delete(entity: ProjectPO): Promise<boolean> {

        const { rowCount } = await this.pool.query(
            'DELETE FROM projects WHERE id = $1',
            [ entity.id ]
        );

        return (rowCount ?? 0) > 0;

    };

};
